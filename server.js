const express = require('express')
const { FieldValue } = require('firebase-admin/firestore')
const app = express()
const port = 8383
const { db } = require('./firebase.js')

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
    if (!doc) {
        return res.sendStatus(404)
    } else {
        var docRef = await db.collection("funcionario").doc(doc);
        docRef.get().then((doc) => {
            if (doc.exists) {
                console.log("Document data:", doc.data());
        
                return res.status(200)
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

app.patch('/changestatus', async (req, res) => {
    const { name, newStatus } = req.body
    const peopleRef = db.collection('people').doc('associates')
    const res2 = await peopleRef.set({
        [name]: newStatus
    }, { merge: true })
    // friends[name] = newStatus
    res.status(200).send(friends)
})

app.delete('/friends', async (req, res) => {
    const { name } = req.body
    const peopleRef = db.collection('people').doc('associates')
    const res2 = await peopleRef.update({
        [name]: FieldValue.delete()
    })
    res.status(200).send(friends)
})

app.listen(port, () => console.log(`Server has started on port: ${port}`))