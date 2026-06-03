const pg = require('pg');
const {Pool, Client} = pg
const express = require('express');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const ldap = require('ldapjs')
const app = express();
app.use(express.json());

const pool = new Pool({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
})

async function Test()
{
    const result = await pool.query('SELECT NOW()');
    console.log(result);
}

function ReadAuth(req, res, next)
{
    const request = req.headers.authorization
    const parsed = request.split(" ")[1];
    const verified = jwt.verify(parsed, process.env.SECRET);

    if(!request)
    {
        return res.status(401).send(error);
    }

    if(verified) {
        req.user = verified;
        next();
    } else {
        return res.status(401).send(error);
    }
}

function ReadRole(allowedrole)
{
    return (req, res, next) => {
        const role = req.user.role;
        if(role == "Admin")
        {
            next();
        }
        if(role != allowedrole)
        {
            return res.status(403).send('Access denied');
        }
        next();
    }
}

Test();


// const client = new Client({
//     user: process.env.PGUSER,
//     password: process.env.PGPASSWORD,
//     host: process.env.PGHOST,
//     port: process.env.PGPORT,
//     database: process.env.PGDATABASE,
// })

// await client.connect()

// console.log(await client.query('SELECT NOW()'))

// await client.end()

function authenticateAD(username, password)
{
    return new Promise((resolve) =>
    {
        const client = ldap.createClient({
            url: "ldaps://dc.biltrobbel.as:636",
            tlsOptions: {rejectUnauthorized: false}
        });

        const userPrincipal = `${username}@biltrobbel.as`;

        client.bind(userPrincipal, password, (err) => {
            if(err) {
                console.log("AD login error:", err.message);
                client.unbind();
                return resolve(false)
            }

            const options = {
                filter: `(sAMAccountName=${username})`,
                scope: 'sub',
                attributes: ['memberOf']
            };
            
            console.log("options:", options);
            
            let roles = []

            client.search("dc=biltrobbel, dc=as", options, (err, searchRes) => {
                searchRes.on('searchEntry', (entry) => {
                    console.log("entry: ", entry)

                    const attributes = entry.attributes.find(x => x.type === "memberOf");
                    const userGroups = attributes.values || [];
                    // const userGroups = entry.object.ou || [];

                    roles = userGroups.map(group => {
                        const match = group.match(/^CN=([^,]+)/);
                        return match ? match[1] : null;
                    }).filter(Boolean);

                    console.log("Roles:", roles);
                });

                searchRes.on('end', () => {
                    console.log();
                    console.log("LDAP SUCCESS");
                    client.unbind();
                    resolve({roles: roles, success: true})
                });
            });
            // resolve({roles: roles, success: true})
        });

        client.on('error', (err) =>
        {
            console.log('LDAP CONNECTION ERROR', err.message);
            resolve(false);
        })
    });

}

app.get('/api', (req, res) => {
  res.json({ message: 'Hello from the server!' });
});

app.get('/api/role', ReadAuth, (req,res) => {
    console.log(req.user.roles)
})

app.post('/api/login', async (req, res) => {

    try {

        const { username, password } = req.body;

        const auth = await authenticateAD(username, password);

        if (!auth.success) {
            return res.json({ success: false });
        }

            const userForToken = {
                username: username,
            }

            const token = jwt.sign(userForToken, process.env.SECRET)

        return res.json({
            success: true,
            roles: auth.roles,
            token: token
        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});

app.get('/api/kunde/getall', ReadAuth , async (req, res) => {
    try{
        const result = await pool.query('SELECT * FROM kunde')
        res.json(result.rows)
    } catch(error)
    {
        console.error("GetAll Failed", error);
        res.status(500).json("Getall failed");
    }
});

app.get('/api/kunde/get/:id', ReadAuth, async (req, res) => {
    try{
        const kunde_id = req.params.id

        const result = await pool.query(
            'SELECT * FROM kunde WHERE id = $1',
            [kunde_id]
        );

        if(result.rows.length == 0)
        {
            return console.log("Result was empty");
        }

        res.json(result.rows[0]);
    } catch(error)
    {
        console.error("Get failed", error);
        res.status(500).json("Get failed");
    }
})

app.post('/api/kunde/post', ReadAuth, async(req, res) => {
    try{
        const {navn} = req.body;
        const result = await pool.query(
            'INSERT INTO kunde (navn) VALUES ($1) RETURNING *',
            [navn]
        );

        res.json(result.rows[0]);
    } catch (error)
    {
        console.error("Post Failed", error);
        res.status(500).json("post failed");
    }

})

app.put('/api/kunde/put/:id', ReadAuth, async(req, res) => {
    try{
        const {navn} = req.body;
        const kunde_id = req.params.id;

        const result = await pool.query(
            'UPDATE kunde SET navn = $1 WHERE id = $2 RETURNING *',
            [navn, kunde_id]
        );
        res.json(result.rows[0]);
    } catch (error)
    {
        console.error("Put Failed", error);
        res.status(500).json("put failed");
    }
})

app.delete('/api/kunde/delete/:id', ReadAuth, async(req, res) => {
    try{
        const kunde_id = req.params.id;
        const result = await pool.query(
            'DELETE FROM kunde WHERE id = $1 RETURNING *',
            [kunde_id]
        );
        res.json(result.rows[0]);
    } catch(error)
    {
        console.error("Delete Failed", error);
        res.status(500).json("delete failed");
    }
})

app.listen(3000, "127.0.0.1", () => {
    console.log("Backend running")
});
