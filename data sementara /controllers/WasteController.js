import Waste from "../models/WasteModel.js";

export const getAllWastes = async (req, res) => {
    try {
        const response = await Waste.findAll({
            attributes: ['id', 'name', 'description', 'management', 'processing']
        });
        res.status(200).json(response);
    } catch (error) {
        console.log({ msg: error.message });
    }
}

export const addWaste = async (req, res) => {
    const { name, description, management, processing } = req.body;

    try {
        const waste = await Waste.create({
            name: name, 
            description: description, 
            management: management,
            processing: processing
        });
        res.status(201).json({ msg: "Waste data successfully added!", waste });
    } catch (error) {
        console.log({ msg: error.message });
    }
}