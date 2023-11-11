*Disclaimer: this application was created in order to learn new language and technologies I was unfamirial with. The code is bad, poorly optimized and not well thought-out. I have experimented with various techniques and technologies in order to learn. Since then I have learned a lot, but I have no intention of refactoring this simple application - it works for my purposes, so I don't care. I might cram in some more features in the future, but I expect to mostly forget this repo, as the application does what I and my small group of users want it to do. Do with this info as you wish.*

# NutCount
This is a very simple calorie counting app. A side-project to learn more raw HTML, JavaScript and SQLite, as well as deploying applications using Electron. Crude and could have been written better, but works for my needs.

# Installation
### Download
You can download the newest version here in the <i>Releases</i> section. The app comes with a simple .bat installer which will copy all the files and create a desktop shortcut for you. If it finds already existing installation, your products database will be copied to the new instantion.

Alternatively, you can simply run the NutCount.exe file to start the app.

### Via npm
You can always clone this repo and use npm to set up all required dependencies for you:
```
git clone https://github.com/m-kolomanski/NutCount.git
cd NutCount
npm install
npm start
```

# Quick-start
Currently the app in only available in Polish (target user requirement). I will add English language support in the future.

Five tabs are available:

### Today
Allows you to count the calorie intake for current day. You can search and find items and add them to the database. Filtering by categories is available. The app will count added callories and display them. You can set two additional values: **burned calories** and **planned deficit**. Based on those three values the app will calculate remaining calories for the day. You can also use the **burned calories** simply as a calorie limit - no need to set the deficit then. A simple calculator for miscallenous items is also available - provide amount and kcal per 100g and total number of calories will be calculated.
### Catalogue
Allows you to add new items to the database. Provide name, calorie value and unit (per 100g or per portion). You can also add and set categories for particular items - simply select any number of categories on the list to the right. This will filter displayed table. Additionally, typing a name will filter the table, so you can see whether a particular item is already present in your database. The app will inform you if provided name matches an existing item. Currently the only way to edit an item is to overwrite it.
### Compose dish
Allows you to compose a dish ingredient list. Main view displays existing dishes, calculated value per 100g and allows you to provide desired portions number - this will calculate weight and calories per portion. From here you can also add container such as pans, pots and boxes, along with their weight. When adding or editing a dish, you will need to provied a name, but also can provide a main container and total weight (including container). This will allow the app to calculate accurate calorie value along with portion size. Here you can add new items to the dish or edit their value - if you are preparing the same dish again, there is no need to add everything again - you can reuse existing recipe and just change weight values for items.
### History
Allows you to view your eating history. Currently just a simple table view is available. From here, you can add particular items to the **today** list, which means there is no need to search the list for repeatable items.
### Options
Currently you can only see some basic info about the app and check for a new version. If updates are available, you will be able to download them directly from the app - no need to visit github!
