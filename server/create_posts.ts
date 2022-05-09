import "isomorphic-fetch";

async function run() {
    const body = {
        user: {
            email: "vuminhle@outlook.com",
            password: "Password123"
        }
    }
    const res = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        body: JSON.stringify(body)
    }).then(r => r.json()).then(d => d)
    console.log(res)
}

run()