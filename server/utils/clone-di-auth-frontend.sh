pwd
cd $1
pwd
rm -rf $2 && mkdir $2
git clone https://github.com/alphagov/di-authentication-frontend.git ./$2
cd $2
npm i 
npm run build
