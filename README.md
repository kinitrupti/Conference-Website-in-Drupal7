# Conference-Website-in-Drupal7
Conference Website in Drupal7

Hello friends,

It was my first time I was creating a website on a professional level. I was called upon to create a website for International conference. So it was a perfect time to make use of the powerful CMS, Drupal. It was a challenge because we had a deadline. It was a challenge as we are using modules which we never used before. We accepted the challenge and started to work on the website.

For domain and hosting of website I used Godaddy but bigrocks is recommended. If you are new to hosting of a website, you can contact me I will guide you step by step regarding hosting of a website. My friend started working on local server while I was working on live which I bought. I had already my own personal domain for which I created subdomain for free. On the subdomain I hosted the website which we were gonna create. When the subdomain is created, the cpanel for the subdomain opens. 

In godaddy there is default applications which need to be installed on the host. I chose Drupal7. I installed it. You can check File manager for all the files & folders related to Drupal7. Then I went to the url of my hosting and found out that Drupal 7 got installed. Now it was time to select a theme. We chose Multipurpose theme of Drupal as we wanted something mobile friendly. We intalled it through Drupal 7 interface Modules->Install new Module.

Now as we wanted to create a conference website, we were trying to research to find a module which is better for conference websites. Then we got several links related to Conference Organizing Distribution(COD). Initially we thought it is a module. Then we realized it is a complete drupal package with conference related features. What I did was I placed the downloaded tar file of COD in subdomain folder in public_html and extracted it. Replace all the folders of drupal with that in COD folder in that path. Delete the COD folder and tar file. Go to the browser and refresh the url. 

Incase you get an error of memory size or limit then give edit permission to public_html/conf/sites/default/seetings.php.

Then edit the settings.php by adding the line
ini_set('memory_limit', '256M');

Save and close the file.

The installation will complete successfully.

We took one of acrofi websites for reference.

Next we used Connector module to login with 

