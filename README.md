# National Park Info Kiosk

A web app that allows users to find information about any National Park
in the United States in an easy and convenient manner by using the official National Park API.
This was built for the Capital One MindSumo problem which can be found at this link: 
https://www.mindsumo.com/contests/national-park-api

Live demo: https://natparkinfokioskcapone.herokuapp.com/

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them

Python3
```
https://www.python.org/downloads/
```

Pipenv
```
https://github.com/pypa/pipenv
```


### Installing

A step by step series of examples that tell you how to get a development env running

If you have have successfully installed Python3 and Pipenv, then you can create a pipenv shell which will create a virtual environment and automatically add any needed Python libraries to run the project.

First clone the repo onto your computer by running, and go into the directory of the repository
```
git clone https://github.com/DanKirichok/NationalParkInfoKiosk
cd NationalParkInfoKiosk
```


Inside the root directory with the Pipfile, run the following command to create a new virtual environment and install all of the necessary Python libraries for the project
```
pipenv shell
```

The next step is to set up the environment variables that are used in the app like the secret key and the API key. You can get a National Park API key at this link: https://www.nps.gov/subjects/developer/get-started.htm. Once you have the key enter the following commands:
```
export SECRET_KEY=<SECRET KEY GOES HERE>
export NPS_API_KEY=<API KEY GOES HERE>

```

Once the libraries are all installed and the environment variables are set up, you can run the local server with the following command inside of the same directory
```
python nationalpark/manage.py runserver
```

This will start the server on your machine, and you can view the website locally by going to: http://127.0.0.1:8000/

Congratulations, you have successfully set up the project!
## Built With

* [django](https://www.djangoproject.com/) - The web framework used
* [National Park API](https://www.nps.gov/subjects/developer/api-documentation.htm#/) - API used to fetch National Park Information
* [Bootstrap](https://getbootstrap.com/) - Used for web design and styling
* [JQuery](https://jquery.com/) - Javascript library

## Authors

* **Dan Kirichok**
