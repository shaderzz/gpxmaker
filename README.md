
# GPXmaker

## Samsung Health json to GPX converter
This script allows you to convert json data from Samsung Health (originally S Health) to GPX file for Strava in pure Javascript

## Demo

Try [Online Demo](https://hitlife.net.ua/ru/gpxmaker)

### Main idea
I get a few workouts into Samsung Galaxy and it is a complete nightmare to get data off of the phone.

While most fitness apps allow you to export completed workout files with the GPS and Heart Rate data, Samsung takes the opposite approach. They make it almost impossible to get a file with HR data, whether you use iOS or Android. Therefore, you can not just take and export your fitness data to your computer and then load onto various fitness apps/platforms. Common file formats like .FIT, .TCX, and even .GPX. It is clear that the data exists in shealth, as I can review previous days heart rate information and see a graph of the seemingly minute by minute data. However, that is the only place I can see the data. It is not possible to review the individual sample information, but it does exist in the app.

Using the built-in .GPX export feature from within Samsung Health works fine for doing it one file at a time, except one catch: It doesn`t export your heart rate data. While the .GPX file format supports HR data just fine, Samsung elected not to put it in there.

But there`s the option: GDPR. Samsung does allow you to submit a request for download personal data synced to the Samsung Health platform from the cloud to your phone. The challenge there is that once you stumble through their automated process, you get a ZIP file back with a crapton of mostly useless non-fitness formatted JSON files. That's why I wrote the parser to fix that situation. 

BTW, I was inspired by [this blog post](https://www.dcrainmaker.com/2019/03/export-data-samsung-watch-galaxy-health-app.html) from DC Rainmaker.


### To get this data, follow these steps:

* In Samsung health (main screen, not on a data screen) go to tripple dot -> settings -> download personal data. 
* After successfully exporting the data, connect the phone to the computer and go to the directory on the phone where the data was saved. For me it was in /Phone/Samsung Health/Download
* the HR/speed data of your exercices is contained in the blob files which are actually gzip file that you can open with 7zip.
* once unzip those blob contained json formatted info, try to find files named "*.live_data.json" and "*.location_data.json". 

For example: 

>27a44eb3-6fc6-4994-bcd1-eccd80074502.live_data.json

>27a44eb3-6fc6-4994-bcd1-eccd80074502.location_data.json

where "27a44eb3-6fc6-4994-bcd1-eccd80074502" is the workout identifier.

live_data contains Live data (e.g. heart rate, speed, power, and so on) during exercise

location_data - Location (trajectory) data during exercise

For the correct preparation of the GPX, we need both of these files. 

* Run index.html from the repository and specify both of these files. As an output you should get the merged GPX file with both, location and live data.

* To import a file, log into the Strava website, then hover the mouse cursor over the plus icon in the top right-hand corner. Select Upload activity, and then switch to the File tab to pick a file from your computer. All of the data it contains will then upload to your Strava account.

The script does not save your data anywhere except your computer, it processes data in real time using JS and gives the resulted file or reports an error. If you have any difficulties or suggestions how to expand the functionality - write to me on Twitter [@ishaderzz](https://twitter.com/ishaderzz)

Want to contribute? Great!

### Todos

 - Write Tests
 - Add gulp, convert css styles to scss
 - Add more formats (.FIT, .TCX)
 - Add file merge support
 - Add Workout preview with map, gps track and other metrics

