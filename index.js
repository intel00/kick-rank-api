const express = require("express")
const axios = require("axios")

const app = express()

app.get("/rank/:user/:tag", async (req, res) => {
    try {
        const user = req.params.user
        const tag = req.params.tag
        console.log("İstek geldi:", user, tag)

        const url =
            `https://valorantrank.chat/eu/${user}/${tag}?onlyRank=true&mmrChange=true`

        const response = await axios.get(url)

        const text = response.data

        // Örnek:
        // Ascendant 1 : 34 RR [18]

        const match = text.match(/^(.+?)\s:\s(\d+)\sRR\s\[([-\d]+)\]$/)

        if (!match) {
            return res.send(text)
        }

        let rank = match[1]
        const rr = match[2]
        const lastMatch = match[3]

        // Rank çevirileri
        const rankTranslations = {
            "Iron": "Demir",
            "Bronze": "Bronz",
            "Silver": "Gümüş",
            "Gold": "Altın",
            "Platinum": "Platin",
            "Diamond": "Elmas",
            "Ascendant": "Yücelik",
            "Immortal": "Ölümsüz",
            "Radiant": "Radyant"
        }

        // Rank ismini değiştir
        Object.keys(rankTranslations).forEach((key) => {
            if (rank.startsWith(key)) {
                rank = rank.replace(key, rankTranslations[key])
            }
        })

        // + işareti ekle
        const lastMatchFormatted =
            lastMatch.startsWith("-")
                ? lastMatch
                : `+${lastMatch}`

        const finalText =
            `${rank} : ${rr} KP | Son Maç: ${lastMatchFormatted} KP`
        
        console.log("Cevap gitti",rank,rr)
        res.send(finalText)
    }
    catch (err) {
        console.log("HATA:")
        console.log(err)
        res.status(500).send("Hata oluştu")
    }
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log("Sunucu çalışıyor")
})
