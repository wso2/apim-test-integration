#!/bin/bash
DB_ENGINE=$1
DB_PASSWORD=$2
DB_HOST=$3
DB_USERNAME=$4
DB_PORT=$5


workingdir=$(pwd)
reldir=`dirname $0`
cd $reldir

source ./utils.sh
isEmpty $DB_ENGINE;
flag=$?
if [ $flag = 1 ];
    then echo "DB engine is empty."; exit 1
fi;

isEmpty $DB_PASSWORD;
flag=$?
if [ $flag = 1 ];
    then echo "DB password is empty."; exit 1
fi;

isEmpty $DB_HOST;
flag=$?
if [ $flag = 1 ];
    then echo "DB host is empty."; exit 1
fi;

isEmpty $DB_USERNAME;
flag=$?
if [ $flag = 1 ];
    then echo "DB username is empty."; exit 1
fi;

isEmpty $DB_PORT;
flag=$?
if [ $flag = 1 ];
    then echo "DB port is empty."; exit 1
fi;

#Run database scripts for given database engine and product version

echo "running db scripts, $DB_USERNAME $DB_HOST $DB_PORT $DB_ENGINE" 
if [[ $DB_ENGINE = "postgres" ]]; then
    echo "running db scripts as mysql, $DB_USERNAME $DB_HOST $DB_PORT $DB_ENGINE" 
    export PGPASSWORD=$DB_PASSWORD
    psql -U "$DB_USERNAME" -h "$DB_HOST" -p "$DB_PORT" -d postgres -f "./$DB_ENGINE/apim.sql"
elif [[ $DB_ENGINE = "mysql" ]]; then
    echo "running db scripts as mysql, $DB_USERNAME $DB_HOST $DB_PORT $DB_ENGINE" 
    mysql -u "$DB_USERNAME" -p"$DB_PASSWORD" -h "$DB_HOST" -P "$DB_PORT" < "./$DB_ENGINE/apim.sql"
elif [[ $DB_ENGINE =~ 'oracle' ]]; then
    # DB Engine : Oracle | Product Version : 2.6.0
    echo "Oracle DB Engine Selected! Running WSO2-APIM 2.6.0 DB Scripts for Oracle..."
    # Create users to the required DB
    echo "DECLARE USER_EXIST INTEGER;"$'\n'"BEGIN SELECT COUNT(*) INTO USER_EXIST FROM dba_users WHERE username='WSO2AM_DB';"$'\n'"IF (USER_EXIST > 0) THEN EXECUTE IMMEDIATE 'DROP USER WSO2AM_DB CASCADE';"$'\n'"END IF;"$'\n'"END;"$'\n'"/" > apim_oracle_user.sql
    echo "DECLARE USER_EXIST INTEGER;"$'\n'"BEGIN SELECT COUNT(*) INTO USER_EXIST FROM dba_users WHERE username='WSO2AM_SHARED_DB';"$'\n'"IF (USER_EXIST > 0) THEN EXECUTE IMMEDIATE 'DROP USER WSO2AM_SHARED_DB CASCADE';"$'\n'"END IF;"$'\n'"END;"$'\n'"/" >> apim_oracle_user.sql
    echo "CREATE USER WSO2AM_SHARED_DB IDENTIFIED BY wso2carbon;"$'\n'"GRANT CONNECT, RESOURCE, DBA TO WSO2AM_SHARED_DB;"$'\n'"GRANT UNLIMITED TABLESPACE TO WSO2AM_SHARED_DB;" >> apim_oracle_user.sql
    echo "CREATE USER WSO2AM_DB IDENTIFIED BY wso2carbon;"$'\n'"GRANT CONNECT, RESOURCE, DBA TO WSO2AM_DB;"$'\n'"GRANT UNLIMITED TABLESPACE TO WSO2AM_DB;" >> apim_oracle_user.sql

    # Create the tables
    echo exit | sqlplus64 "$DB_USERNAME/$DB_PASSWORD@(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(Host=$DB_HOST)(Port=$DB_PORT))(CONNECT_DATA=(SID=ORCL)))" @apim_oracle_user.sql
    echo exit | sqlplus64 "WSO2AM_SHARED_DB/wso2carbon@(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(Host=$DB_HOST)(Port=$DB_PORT))(CONNECT_DATA=(SID=ORCL)))" @"./$DB_ENGINE/apim_am_shared.sql"
    echo exit | sqlplus64 "WSO2AM_DB/wso2carbon@(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(Host=$DB_HOST)(Port=$DB_PORT))(CONNECT_DATA=(SID=ORCL)))" @"./$DB_ENGINE/apim_am.sql"
elif [[ $DB_ENGINE =~ 'mssql' ]]; then
    # DB Engine : SQLServer | Product Version : 2.6.0
    echo "SQL Server DB Engine Selected! Running WSO2-APIM 2.6.0 DB Scripts for SQL Server..."
    sqlcmd -S "$DB_HOST" -U "$DB_USERNAME" -P "$DB_PASSWORD" -i "./$DB_ENGINE/apim.sql"
fi