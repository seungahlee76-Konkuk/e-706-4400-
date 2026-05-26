import { initializeApp } from 'firebase/app';
  import { getAuth, GoogleAuthProvider } from 'firebase/auth';
  import { getFirestore } from 'firebase/firestore';
  import firebaseConfig from '../../firebase-applet-config.json';

  // 넷플리파이 금고 또는 로컬 환경변수에서 진짜 열쇠 꺼내오기 (fallback 지원)

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY || firebaseConfig.apiKey || "";
if (!apiKey) {
  console.warn(
    "⚠️ Firebase API Key가 구성되지 않았습니다.\n" +
    "구글 AI 스튜디오 설정(Secrets)이나 .env 파일, 또는 Netlify 환경 변수에 VITE_FIREBASE_API_KEY를 설정해주세요."
  );
}

const finalConfig = {
  ...firebaseConfig,
  apiKey: apiKey || ""
};

const app = initializeApp(finalConfig);
export const db = getFirestore(app, finalConfig.firestoreDatabaseId); /* CRITICAL: The app will break without this line */
  export const auth = getAuth(app);
  export const googleProvider = new GoogleAuthProvider();

  // Enforce select account dialog on logins
  googleProvider.setCustomParameters({
    prompt: 'select_account'
  });

  export enum OperationType {
    CREATE = 'create',
    UPDATE = 'update',
    DELETE = 'delete',
    LIST = 'list',
    GET = 'get',
    WRITE = 'write',
  }

  export interface FirestoreErrorInfo {
    error: string;
    operationType: OperationType;
    path: string | null;
    authInfo: {
      userId?: string | null;
      email?: string | null;
      emailVerified?: boolean | null;
      isAnonymous?: boolean | null;
      tenantId?: string | null;
      providerInfo?: {
        providerId?: string | null;
        email?: string | null;
      }[];
    }
  }

  export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
    const errInfo: FirestoreErrorInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: auth.currentUser?.uid,
        email: auth.currentUser?.email,
        emailVerified: auth.currentUser?.emailVerified,
        isAnonymous: auth.currentUser?.isAnonymous,
        tenantId: auth.currentUser?.tenantId,
        providerInfo: auth.currentUser?.providerData?.map(provider => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || []
      },
      operationType,
      path
    };
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    throw new Error(JSON.stringify(errInfo));
  }
