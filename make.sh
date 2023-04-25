VERSION=$(grep "version" package.json | awk -F " " '{print$2}' | sed 's/"\|,//g')
read -p "Provide version (leave empty for package.json $VERSION): " new_version

if [[ -n "$new_version" ]]; then
    echo "Adding new version to package.json..."
    sed "s/$VERSION/$new_version/" package.json > package2.json
    rm package.json
    mv package2.json package.json
    VERSION=$new_version
fi

echo "Making NutCount version $VERSION..."
rm -r ./out/
npm run make ||
    { echo "Electron forge encountered a problem, aborting"; exit 0; }
echo "Packaging..."
cp installer.bat ./out/installer.bat
cd ./out
rm ./NutCount-win32-x64/resources/app/db/*
rm -r ./make/
mkdir "NutCount-$VERSION"
mv -v ./* "./NutCount-$VERSION/"
echo "Compressing..."
tar -zcf "NutCount-$VERSION.tar.gz" "NutCount-$VERSION"
echo "Done."