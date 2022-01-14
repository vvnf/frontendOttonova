module.exports=[
    {
        context:["/getToken","/refresh","/cityList","/countryFlag"],
        target: "http://localhost:3000/api/",
        secure:false,
        logLevel:"debug",
    }
]