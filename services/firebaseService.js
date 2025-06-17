import { initializeApp } from "firebase/app";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "firebase/auth";
import {
    getFirestore,
    setDoc,
    doc,
    collection,
    getDoc
} from "firebase/firestore";
import { firebaseConfig } from "../config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

const firebaseServices = {
    registrarNovoUsuario: (email, senha, onSuccess, onError) => {
        createUserWithEmailAndPassword(auth, email, senha)
            .then(async (userCredential) => {
                console.log('Usuário registrado com sucesso:', userCredential.user.uid);
                const user = userCredential.user;
                const tipoMap = {
                    cliente: !!tipo?.cliente,
                    freelancer: !!tipo?.cliente,
                };
                await setDoc(doc(db, "Users", user.uid), {
                    email: user.email,
                    nome: nome,
                    tipo: tipoMap,
                });
                onSuccess(user);
            })
            .catch((error) => {
                console.error('Erro ao registrar usuário', error);
                onError(error.code, error.message);
            });
    },

    loginEmailSenha: (email, senha) => {
        return new Promise((resolve, reject) => {
            signInWithEmailAndPassword(auth, email, senha)
                .then((userCredential) => {
                    resolve(userCredential.user);
                })
                .catch((error) => {
                    reject(error.message);
                });
        });
    }
};

export default firebaseServices;

// Função para salvar um serviço no Firestore
export function salvarServico(servico) {
    const docref = doc(collection(db, "servicos"));
    setDoc(docref, servico)
        .then(() => {
            console.log("Serviço salvo com sucesso. ID", docref.id);
        })
        .catch((error) => {
            console.error("Erro ao salvar serviço:", error);
        });
}

// Função para buscar todos os serviços cadastrados
export async function buscarServicos() {
    return new Promise ((resolve, reject) => {
        getDocs(collection(db, "servicos "))
    .then((querySnapshot) => {
        const listaServicos = [];
        querySnapshot.forEach((doc) => {
            let servico = doc.data();
            servico.id = doc.id;
            listaServicos.push(servico);
        });
        resolve(listaServicos);
    })
    .catch((error) => {
        reject(error);
    });
    });
}