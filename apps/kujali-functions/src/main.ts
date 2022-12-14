
import { config } from 'firebase-functions';
import * as admin from 'firebase-admin';


const conf = config()['firebase'];
admin.initializeApp(conf);