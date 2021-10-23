import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
	apiKey: 'AIzaSyBfQkJPwl6EP6Ew8rls3qcedtNqv1B9kyY',
	authDomain: 'gm-organizer-ccd2d.firebaseapp.com',
	projectId: 'gm-organizer-ccd2d',
	storageBucket: 'gm-organizer-ccd2d.appspot.com',
	messagingSenderId: '818055170863',
	appId: '1:818055170863:web:7e00ece93efa25150befda',
	measurementId: 'G-GSH3F61XGV',
};

if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
}

// todo at some point move for firebase 9 support with typescript...
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export const firestore = firebase.firestore();
export const storage = firebase.storage();

// Helper functions
export async function getUserWithUsername(username: string | string[]) {
	const usersRef = firestore.collection('users');
	const query = usersRef.where('username', '==', username).limit(1);
	const userDoc = (await query.get()).docs[0];
	return userDoc;
}

export function postToJSON(doc: firebase.firestore.DocumentSnapshot) {
	const data = doc.data();

	return {
		...data,
		//not automatically JSONizable for firestore timestamps are not generic types
		createdAt: data?.createdAt?.toMillis() || 0,
		updatedAt: data?.updatedAt?.toMillis() || 0,
	};
}

export const fromMillis = firebase.firestore.Timestamp.fromMillis;
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED;
export const increment = firebase.firestore.FieldValue.increment;