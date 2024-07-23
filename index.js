import express from 'express';
import session from 'express-session';
import cors from 'cors';
import expressOasGenerator from "@mickeymond/express-oas-generator";
import MongoStore from 'connect-mongo';
import {dbConnect} from './config/db.js';
import userRouter from './routes/user.js';
import userProfileRouter from './routes/userProfile.js';
import skillRouter from './routes/skills.js';
import volunteeringRouter from './routes/volunteering.js';
import projectRouter from './routes/projects.js';
import { licenseRouter } from './routes/license_certification.js';
import { achievementRouter } from './routes/achievement.js';
import { educationRouter } from './routes/education.js';
import { experienceRouter } from './routes/experience.js';
import mongoose from 'mongoose';
import { restartServer } from './restartServer.js';

// Create express app
const portfolioapp = express();
expressOasGenerator.handleResponses(portfolioapp, {
    alwaysServeDocs: true,
    tags: ['profile', 'skills', 'projects', 'volunteering', 'auth', 'achievements', 'educations', 'experiences', 'licenses'],
    mongooseModels: mongoose.modelNames(),
})

//Apply midlleware
portfolioapp.use(cors({credentials: true, origin: '*'}));
portfolioapp.use(express.json());
portfolioapp.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    // Store session
    store: MongoStore.create({
        mongoUrl: process.env.CONNECT_STRING
    })
}));

portfolioapp.get("/api/v1/portfoliohealth", (req, res) => {
    res.json({ status: "UP" });
  });
  

// Use routes
portfolioapp.use('/api/v1', userRouter)
portfolioapp.use('/api/v1', userProfileRouter)
portfolioapp.use('/api/v1', skillRouter)
portfolioapp.use('/api/v1', volunteeringRouter)
portfolioapp.use('/api/v1', projectRouter)
portfolioapp.use('/api/v1', licenseRouter)
portfolioapp.use('/api/v1', achievementRouter)
portfolioapp.use('/api/v1', educationRouter)
portfolioapp.use('/api/v1', experienceRouter)

expressOasGenerator.handleRequests();
portfolioapp.use((req, res) => res.redirect('/api-docs/'));

const reboot = async () => {
    setInterval(restartServer, process.env.INTERVAL)
    }

// Listen for incoming requests
const port = process.env.PORT || 8080;

dbConnect().then(() => {
portfolioapp.listen( port , () => {
    reboot().then(() => {
        console.log(`Server Restarted`);
      });
    console.log(`Portfolio App listening on port ${port}`);
});
})
.catch((err) => {
  console.log(err);
  process.exit(-1);
});
