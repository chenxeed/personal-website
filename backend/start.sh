if [ ${ENV} = "DEV" ]; then 
    npm run start:dev
else
    npm run build && npm run start:prod
fi