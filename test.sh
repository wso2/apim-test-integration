workingdir=$(pwd)
reldir=`dirname $0`
cd $reldir

sh ./test-apim/${test_file_path}

cd "$workingdir"