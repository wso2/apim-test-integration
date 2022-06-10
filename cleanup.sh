workingdir=$(pwd)
reldir=`dirname $0`
cd $reldir

echo "Uninstalling APIM in cluster."
helm uninstall "${product_name}" || true

cd "$workingdir"