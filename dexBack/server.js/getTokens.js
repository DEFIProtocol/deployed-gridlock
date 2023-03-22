import clientPromise from "./mongodb";

export default async function getTokens(req, res) {
    const client = await clientPromise;
    const db = client.db("gridlockDb")
    
    switch(req.method) {
        case "POST":
            let bodyObject = JSON.parse(req.body);
            let newToken = await db.collection("tokens").insertOne(bodyObject);
            res.json(newToken.ops[0]);
            break;
        case "GET":
            const allTokens = await db.collection("tokens")
                .find({})
                .toArray();
            res.json({status: 200, data: tokens });
            break;
    }
}