const express = require('express')
const { FieldValue } = require('firebase-admin/firestore')
const app = express()
const port = 8383
const { db } = require('./firebase.js')

const {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    deleteDoc
}= require('firebase/firestore')

app.use(express.json())

//OK
app.get('/funcionarios', async (req, res) => {
    const querySnapshot = await db.collection("funcionario").get()
    const funcionarios = []

    querySnapshot.forEach(doc => {
        funcionarios.push({ id: doc.id, data: doc.data() })
    })

    res.send({ status: 200, funcionarios })
})

//OK
app.get('/funcionarios/:doc', async (req, res) => {
    const { doc } = req.params
    const funcionario = []
    if (!doc) {
        return res.sendStatus(404)
    } else {
        var docRef = await db.collection("funcionario").doc(doc);
        docRef.get().then((doc) => {
            if (doc.exists) {
                console.log("Document data:", doc.data());
                funcionario.push({ id: doc.id, data: doc.data() })
                return res.send({ status: 200, funcionario })
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
            return res.sendStatus(404)
        });
    }
 
})

//OK
app.post('/addfuncionario', async (req, res) => {
    const funcRef = db.collection("funcionario")
    const {
        nome,
        departamento,
        cidade_trabalho,
        cidade_nascimento,
        sexo,
        data_nascimento,
        cidade_residência,
        data_admissão,
        data_demissão
    } = req.body;
 
    await funcRef.add({
        nome,
        departamento,
        cidade_trabalho,
        cidade_nascimento,
        sexo,
        data_nascimento,
        cidade_residência,
        data_admissão,
        data_demissão
    })
    .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });

    res.status(200).send("ok")
})

app.patch('/changedepartamento/:doc', async (req, res) => {
    const { doc } = req.params
    const { atributo, newStatus } = req.body
    
    try {
        var docRef = await db.collection("funcionario").doc(doc)
        .update({
            [atributo]: newStatus
        }, { merge: true })
        return res.send({ status: 200, docRef, [atributo]: newStatus })
    } catch (e) {
        return { message: "Error: ", e }
    }
})

app.delete('/removeatributo/:doc', async (req, res) => {
    const { doc } = req.params
    console.log(doc)
    const { atributo } = req.body
    console.log(atributo)
    try {
        var docRef = await db.collection("funcionario").doc(doc)
        .update({
            [atributo]: FieldValue.delete()
        })
        return res.send({ status: 200, docRef, atributo })
    } catch (e) {
        return { message: "Error: ", e }
    }
})

app.delete('/funcionario/:doc', async (req, res) => {
    const { doc } = req.params
    if (!doc) {
        return res.sendStatus(404)
    } else {
        var docRef = await db.collection("funcionario").doc(doc);
        if((await docRef.get(doc)).data() != null){
            docRef.delete().then((doc) => {
                console.log("Document successfully deleted!");
            }).catch((error) => {
                console.log("Error removing document:", error);
                return res.sendStatus(404)
            });
        }
    }
})
app.listen(port, () => console.log(`Server has started on port: ${port}`))