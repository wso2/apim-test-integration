#!/bin/bash
# -------------------------------------------------------------------------------------
# Copyright (c) 2025 WSO2 LLC. (http://www.wso2.org) All Rights Reserved.
#
# WSO2 LLC. licenses this file to you under the Apache License,
# Version 2.0 (the "License"); you may not use this file except
# in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.
#
# --------------------------------------------------------------------------------------
set -e

# === Configuration ===
JDK_TYPE=$1
INFRA_JSON=$2
MIGRATION_RESOURCES_LOCATION=$3
DB_TYPE=$4
WORKSPACE=/opt/testgrid/workspace
APIM_VERSION="4.5.0"
SOURCE_VERSION="3.2.0"
APIM_HOME="${WORKSPACE}/wso2am-${APIM_VERSION}"
IS_MIGRATION_LOG_FILE="$APIM_HOME/repository/logs/is-migration-$DB_TYPE.log"
APIM_MIGRATION_LOG_FILE="$APIM_HOME/repository/logs/apim-migration-$DB_TYPE.log"
CONFIG_FILE="${APIM_HOME}/repository/conf/deployment.toml"
TIMEOUT=600 # 10 minutes in seconds

function install_jdk() {
    if [ -z "$JAVA_HOME" ]; then
        jdk_name=$1

        mkdir -p /opt/${jdk_name}
        jdk_file=$(jq -r --arg name "$jdk_name" '.jdk[] | select(.name == $name) | .file_name' "${INFRA_JSON}")
        
        wget -q "https://integration-testgrid-resources.s3.amazonaws.com/lib/jdk/${jdk_file}.tar.gz"
        tar -xzf "${jdk_file}.tar.gz" -C /opt/${jdk_name} --strip-components=1

        export JAVA_HOME=/opt/${jdk_name}
        export PATH=$JAVA_HOME/bin:$PATH
        echo "JAVA_HOME set to $JAVA_HOME"
    else
        echo "JAVA_HOME is already set to $JAVA_HOME. Skipping JDK installation."
    fi
}
install_jdk ${JDK_TYPE}

# S3 base path
S3_BASE_PATH="s3://integration-testgrid-resources/apim-migration-resources/migrate-to-${APIM_VERSION}"

# Get the latest WSO2 AM migration client
wso2am_file=$(aws s3 ls ${S3_BASE_PATH}/ | awk '{print $4}' | grep '^wso2am-migration-.*\.zip$' | sort -V | tail -n1)

# Get the latest WSO2 IS migration client
wso2is_file=$(aws s3 ls ${S3_BASE_PATH}/ | awk '{print $4}' | grep '^wso2is-migration-.*\.zip$' | sort -V | tail -n1)

# Print what files will be downloaded
echo "Latest WSO2 AM Migration Client: $wso2am_file"
echo "Latest WSO2 IS Migration Client: $wso2is_file"

# Copy files from S3
aws s3 cp "${S3_BASE_PATH}/${wso2am_file}" .
aws s3 cp "${S3_BASE_PATH}/${wso2is_file}" .

unzip -q -o "${WORKSPACE}/${wso2am_file}" -d "$WORKSPACE"
unzip -q -o "${WORKSPACE}/${wso2is_file}" -d "$WORKSPACE"

APIM_MIGRATION_RESOURCES_DIR="${wso2am_file%.zip}"
IS_MIGRATION_RESOURCES_DIR="${wso2is_file%.zip}"

echo "Replace the deployment.toml file..."
wget "${MIGRATION_RESOURCES_LOCATION}deployment.toml"
cp deployment.toml "$APIM_HOME/repository/conf/"

echo "Replace the migration-config.yaml file..."
wget "${MIGRATION_RESOURCES_LOCATION}migration-config.yaml"
cp migration-config.yaml "${IS_MIGRATION_RESOURCES_DIR}/migration-resources/"

echo "Copying IS migration-resources..."
cp -r "${IS_MIGRATION_RESOURCES_DIR}/migration-resources" "$APIM_HOME/"

echo "Copyin IS migration .jar files..."
cp "${IS_MIGRATION_RESOURCES_DIR}/dropins/"*.jar "$APIM_HOME/repository/components/dropins/"

echo "Starting IS migration..."
sudo chmod 755 $APIM_HOME/bin/api-manager.sh
nohup sh "$APIM_HOME/bin/api-manager.sh" -Dmigrate -Dcomponent=identity > "$IS_MIGRATION_LOG_FILE" 2>&1 &
SERVER_PID=$!

while [ ! -f "$IS_MIGRATION_LOG_FILE" ]; do sleep 2; done

echo "Waiting for IS migration to complete..."

IS_START_TRIGGER="Executing Migration client"
IS_END_TRIGGER="##################################  ALERT  ##################################"

is_analysis_started=0
is_start_time=$(date +%s)

tail -n0 -F "$IS_MIGRATION_LOG_FILE" | while true; do
    if ! read -r -t $TIMEOUT line; then
        echo "No new log lines for $((TIMEOUT/60)) minutes. Migration timed out."
        echo "------ IS Log file content ------"
        cat "$IS_MIGRATION_LOG_FILE"
        echo "Migration failed due to timeout."
        exit 1
    fi

    is_current_time=$(date +%s)
    is_elapsed=$((is_current_time - is_start_time))

    
    if [[ $is_elapsed -ge $TIMEOUT ]]; then
        echo "Migration timed out after $TIMEOUT seconds"
        echo "------ IS Log file content ------"
        cat "$IS_MIGRATION_LOG_FILE"
        echo "Migration failed due to timeout."
        exit 1
    fi

    if [[ $is_analysis_started -eq 0 ]]; then
        # Wait for the analysis start trigger
        if grep -qF "$IS_START_TRIGGER" <<< "$line"; then
            is_analysis_started=1
        fi
        continue
    fi

    # If end trigger is found, exit successfully
    if grep -qF "$IS_END_TRIGGER" <<< "$line"; then
        echo "Identity Component Migration completed successfully"
        break
    fi

    if grep -qE 'ERROR' <<< "$line"; then
        echo "Fatal error detected during the Identity Component Migration:"
        echo "$line"
        echo "------ IS Log file content ------"
        cat "$IS_MIGRATION_LOG_FILE"
        exit 1
    fi
done

echo "Stopping server after the identity component migration..."
sh "$APIM_HOME/bin/api-manager.sh" --stop
sleep 15

echo "Cleaning up identity migration resources..."
rm -rf "${APIM_HOME}/migration-resources"
rm -f "${APIM_HOME}/repository/components/dropins/org.wso2.carbon.is.migration"*.jar

echo "Copying APIM migration-resources..."
cp -r "${APIM_MIGRATION_RESOURCES_DIR}/migration-resources" "$APIM_HOME/"

echo "Copying APIM migration .jar files..."
cp "${APIM_MIGRATION_RESOURCES_DIR}/dropins/"*.jar "$APIM_HOME/repository/components/dropins/"

echo "Starting APIM migration..."
sudo chmod 755 $APIM_HOME/bin/api-manager.sh
nohup sh "$APIM_HOME/bin/api-manager.sh" -Dmigrate -DmigrateFromVersion="$SOURCE_VERSION" > "$APIM_MIGRATION_LOG_FILE" 2>&1 &
SERVER_PID=$!

echo "Waiting for server to start..."
while [ ! -f "$APIM_MIGRATION_LOG_FILE" ]; do sleep 2; done

echo "Waiting for APIM migration to complete..."

START_TRIGGER="Running on migration enabled mode: Stopped at ServerStartupListener completed"
END_TRIGGER="APIMMigrationClient WSO2 API-M Migration Task : Successfully completed API-M migration"
IGNORE_PATTERN='SQL script not found at .*/migration-(4.1.0_to_4.2.0|4.2.0_to_4.3.0)'

analysis_started=0
start_time=$(date +%s)

tail -n0 -F "$APIM_MIGRATION_LOG_FILE" | while true; do
    if ! read -r -t $TIMEOUT line; then
        echo "No new log lines for $((TIMEOUT/60)) minutes. Migration timed out."
        echo "------ IS Log file content ------"
        cat "$IS_MIGRATION_LOG_FILE"
        echo "------ APIM Log file content ------"
        cat "$APIM_MIGRATION_LOG_FILE"
        echo "Migration failed due to timeout."
        exit 1
    fi

    current_time=$(date +%s)
    ielapsed=$((current_time - start_time))

    # Timeout check
    if [[ $elapsed -ge $TIMEOUT ]]; then
        echo "APIM Migration timed out after $TIMEOUT seconds"
        echo "------ IS Log file content ------"
        cat "$IS_MIGRATION_LOG_FILE"
        echo "------ APIM Log file content ------"
        cat "$APIM_MIGRATION_LOG_FILE"
        echo "Migration failed due to timeout."
        exit 1
    fi

    if [[ $analysis_started -eq 0 ]]; then
        # Wait for the analysis start trigger
        if grep -qF "$START_TRIGGER" <<< "$line"; then
            analysis_started=1
        fi
        continue
    fi

    # If end trigger is found, exit successfully
    if grep -qF "$END_TRIGGER" <<< "$line"; then
        echo "Migration completed successfully"
        break
    fi

    # Check for errors, excluding false positives
    if grep -qE 'ERROR' <<< "$line" && \
       ! grep -qE "$IGNORE_PATTERN" <<< "$line"; then
        echo "Fatal error detected during migration:"
        echo "$line"
        echo "------ IS Log file content ------"
        cat "$IS_MIGRATION_LOG_FILE"
        echo "------ APIM Log file content ------"
        cat "$APIM_MIGRATION_LOG_FILE"
        exit 1
    fi
done

echo "Stopping server after the APIM migration..."
sh "$APIM_HOME/bin/api-manager.sh" --stop
sleep 15

echo "Updating indexing config for re_indexing..."
if grep -q "^\[indexing\]" "$CONFIG_FILE"; then
   sed -i.bak '/^\[indexing\]/,/^\[/{s/^indexing *=.*/re_indexing = 1/}' "$CONFIG_FILE"
   echo "Re-indexing enabled."
else
   echo "[indexing] section not found."
fi

echo "Cleaning up migration resources..."
rm -rf "${APIM_HOME}/migration-resources"
rm -f "${APIM_HOME}/repository/components/dropins/org.wso2.carbon.apimgt.migrate.client"*.jar

echo "##### IS Migration Log #####"
echo "-----------------------------------------------------------------"
cat "$IS_MIGRATION_LOG_FILE"
echo "-----------------------------------------------------------------"
echo "##### APIM Migration Log #####"
echo "-----------------------------------------------------------------"
cat "$APIM_MIGRATION_LOG_FILE"
echo "-----------------------------------------------------------------"
