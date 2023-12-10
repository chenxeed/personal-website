if [ ${ENV} = "DEV" ]; then 
    npm run dev
else
    npm run build && npm run start
fi