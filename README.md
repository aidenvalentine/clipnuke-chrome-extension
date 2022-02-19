# ClipNuke Chrome Extension
 It's like a form-filler.
 Content Distribution Suite for Clips4Sale, ManyVids, OnlyFans, Xvideos, and Pornhub. No more copy/paste when adding your clips to a new clipstore!

## Installation
1. Download the latest version of the ClipNuke Chrome extension from [https://clipnuke.com/wp-content/uploads/clipnuke-chrome-extension.zip](https://clipnuke.com/wp-content/uploads/clipnuke-chrome-extension.zip)
1. Extract to a folder on your PC.
1. Navigate to [chrome://extensions/](chrome://extensions/), enable **Developer mode** and click "Load Unpacked" button.
1. Select the `/` dir  (or `/build` directory if you're using GitHub source code) where you unzipped this extension. (Which contains the manifest file).
![Chrome Installation](/docs/images/chrome-installation.png)

## Getting Started
1. [Sign up for a clipnuke.com account](https://clipnuke.com/my-account/).
1. Add your video metadata (and files) to ClipNuke.

## Tour
[![Watch a demo of this software in action](/docs/images/clipnuke-tour.jpg)](/docs/video/ClipNuke-Tour_hd.mp4)
[Watch a demo of this software in action](/docs/video/ClipNuke-Tour_hd.mp4)

![Clips4Sale](/docs/images/clips4sale-example-hilight.jpg)
Clips4Sale API automatically fills out the required fields on the add clip page using the video's metadata saved to your clipnuke account.

![XVideos](/docs/images/xvideos-example-hilight.jpg)
Some sites like PornHub and XVideos allow a user to specify 10+ translations for each title. ClipNuke includes an AI to **automatically translate the title to all languages with one click**. Imagine using Google Translate to translate each movie title to 30 different languages by hand. No thanks!

![PornHub](/docs/images/pornhub-example-hilight.jpg)
Pornhub also allows a user to specify translated movie titles to increase international viewership.

![ManyVids](/docs/images/manyvids-example-hilight.jpg)
**One-click launch**. Upload the video to a distributor's site and prefill the form right from clipnuke.com. No more copy-paste.

![Dashboard](/docs/images/admin-dashboard.PNG)
Track how much progress you've made with each distributor's site *at a glance*, and how many clips you still have left to launch. Link each clip to the video file on the distributor's site -- so you know which one's you've already uploaded, and which one's you still need to monetize.

## Features
- AI Auto-translator
- Search Engine to find your clips.
- Spreadsheet view that allows you to see what videos are uploaded to which site -- arranging sites by columns.

## Notes
- Using a browser extension allows the user to make changes (or complete) the form data while posting a new video. A producer may need to attach a 2257 model release, Driver's License, or other compliance document to each video. So we'll never be able to achieve full automation on those sites -- but this is the **best solution** by far. A sidekick app that modifies the upload video form itself when a user visit's the page.

What are you waiting for? Power up your clip store today! Mo' clips equals mo' money.

## To-Do
1. Autosave prompt when creating a new product on Clips4Sale/Manyvids to create new product on ClipNuke.
1. Sync button -- pull data from clips4sale and update the product data with it.
1. Add OnlyFans, ExtraLunchMoney, ModelCentro, and more distributors.
