const db = require("../models");
const Note = db.noteModel;

module.exports = {
    addAll: async function (req, res) {
        try {
            const notesData = req.body.notes;

            if (!notesData || !Array.isArray(notesData) || notesData.length === 0) {
                return res.status(400).send({ message: "Le tableau de notes est vide." });
            }

            const nouvellesNotes = await Note.bulkCreate(notesData, { validate: true });

            res.status(201).send({
                message: `${nouvellesNotes.length} notes enregistrées !`,
                data: nouvellesNotes
            });

        } catch (error) {
            res.status(500).send({
                message: "Erreur lors de l'ajout groupé.",
                error: error.message
            });
        }
    },
    add : async function (req,res){
        try {
            const { valeur, appreciation, etudiantId, matiereId, professeurId } = req.body;

            if (valeur===undefined || !etudiantId || !matiereId || !professeurId) {
                return res.status(400).send({
                    message: "Tous les champs obligatoires ne sont pas remplis."
                });
            }
            const nouvelleNote = await Note.create({
                valeur: valeur,
                appreciation: appreciation || null,
                etudiantId: etudiantId,
                matiereId: matiereId,
                professeurId: professeurId
            });

            res.status(201).send({
                message: "Note ajoutée avec succès !",
                data: nouvelleNote
            });

        } catch (error) {
            res.status(500).send({
                message: "Erreur lors de l'ajout de la note.",
                error: error.message
            });
        }
    }
}