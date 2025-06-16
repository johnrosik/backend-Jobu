import admin from 'firebase-admin';

const db = admin.firestore();
const usersCollection = db.collection('Users');

const usersService = {
    // Buscar usuário por ID
    async getUserById(id) {
        const doc = await usersCollection.doc(id).get();
        if (!doc.exists) return null;
        return { id: doc.id, ...doc.data() };
    },

    // Criar novo usuário
    async createUser(data) {
        // data deve conter os campos do usuário, ex: nome, email, etc.
        const docRef = await usersCollection.add(data);
        return { id: docRef.id, ...data };
    },

    // Atualizar usuário existente
    async updateUser(id, data) {
        await usersCollection.doc(id).update(data);
        const updatedDoc = await usersCollection.doc(id).get();
        return { id: updatedDoc.id, ...updatedDoc.data() };
    },

    // Deletar usuário
    async deleteUser(id) {
        await usersCollection.doc(id).delete();
        return { success: true };
    },

    // Listar todos os usuários
    async listUsers() {
        const snapshot = await usersCollection.get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
};

export default usersService;