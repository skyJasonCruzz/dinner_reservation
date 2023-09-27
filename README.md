# Welcome to Dinner Reservation App

**This App includes the following tech:**
- Django for backend
- React for frontend
- Tailwind for styles

**A very brief summary**

This application allows users to create, update, and cancel their dinner reservation. They can as well view other reservations.

**This app includes the following validations**

-   There can only be 3 reservations made per 30 minutes.

-   Users can create reservations via a form.

-   Users can see a list of reservations.

-   Users can update/edit the reservations they made 2 days before the actual reservation

    date.

-   Users can delete the reservations they made 2 days before the actual reservation date.

# Get Started

**Backend**

- Make sure to have python atleast 3.9 or higher (recommended, not tested in lower versions)
- Create your own venv if you prefer
- Run the following commands inside the project-root-path/backend
- run `pip install -r requirements.txt` to ensure you have all the required packages for this application's backend
- to start a local server run `./manage.py runserver`
- In case you are wondering, the sqlite3 database attached already has a database which has migrations applied on it.  run `./manage.py migrate` in case migrations are missing
- Accessible in port 8000

**Frontend**
- Node v20 is used for this (not tested in lower versions)
- NPM v8 is used for this  (not tested in lower versions)
- Run the following commands inside the project-root-path/frontend/dinner_reservation
- Run `npm install` to make sure all the required packages listed in package.json will be installed
- To run a local development server in the frontend, run `npm start`
- To build use `npm run build`
- Accessible in port 3000

**There are some notable comments at the code to help you out understanding.**

**To whoever sees this, I hope you have a great day!**