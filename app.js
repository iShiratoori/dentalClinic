if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const ExpressError = require('./utils/expressError')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/users')
const userRoute = require('./routers/userRoute')
const dentistRouter = require('./routers/dentistRouter')
const patientRouter = require('./routers/patientRouter')
const adminRouter = require('./routers/adminRouter')
const messagesRoute = require('./routers/messagesRoute')
const calendar = require('./utils/calendar')
const helmet = require('helmet')
const MongoStore = require('connect-mongo');
const app = express();

// DB Connection
const dbUrl = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dentalClinic';
mongoose.connect(dbUrl);
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


const UpcommingAppointment = require('./models/upcomingAppointment')


app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))


app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://code.jquery.com/",
];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dm7zftkof/"
            ],
            connectSrc: ["'self'", "http://localhost:3000/js/dashboard.js"] // Add the allowed sources for connecting to
        },
    })
);


const store = new MongoStore({
    mongoUrl: dbUrl,
    secret: 'Thisismyliitlesecret',
    touchAfter: 24 * 60 * 60
});
store.on("error", function (e) {
    console.log("SESSION STORE ERROR: ", e)
})

const sessionConfig = {
    store,
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash());

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    const { generateCalendar } = calendar;
    const date = generateCalendar({ month: 0, year: 0 });
    res.locals.dateAndTime = date;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;

    res.locals.directory = {
        parts: req.originalUrl.split("/").filter(Boolean),
        navigator: 'bi bi-chevron-right mx-2',
        getDirectory: function (index) {
            let dir = `/${this.parts[0]}/`;
            for (let i = 1; i < index + 1; ++i) {
                dir += this.parts[i] + '/'
            }
            return dir;
        },
        islast: function (data) {
            return data === this.parts.length;
        }
    };
    next();
})

app.get('/', (req, res) => {
    res.render('home')
})

app.use('/', userRoute)
app.use('/admin', adminRouter)
app.use('/patient', patientRouter)
app.use('/dentist', dentistRouter)
app.use('/messages', messagesRoute)

app.get('/api/data', async (req, res, next) => {
    const { patient_ticket, action } = req.query
    const patients = await UpcommingAppointment.findOne({});
    const result = await patients.findByTicket(patient_ticket)
    if (!result) {
        const message = {
            title: 'Not Found',
            text: 'Sorry the patient that you are is not found in our database.'
        };
        throw next(new ExpressError(message, 404))
    }

    if (result.action !== action) {
        return res.send(result.action)
    }
    res.send(action);
});
app.get('/api/getclock', (req, res) => {
    if (true) {
        closingTime = ({
            title: 'We are closing in',
            time: ({
                hour: 1,
                minute: 59,
                second: 13
            })
        })
        return res.send(closingTime)
    }
    res.send('failed')
})


app.all('*', (req, res, next) => {
    const message = {
        title: 'Page not Found',
        text: 'Sorry about that! We can\'t find the page you\'re looking for. Please use the search bar above or one of these buttons below.'
    };
    next(new ExpressError(message, 404))
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    const { title = 'Oh No, Something Went Wrong!', text = err.message } = err.message;
    res.status(statusCode).render('error', { statusCode, title, text })
});


module.exports = app
