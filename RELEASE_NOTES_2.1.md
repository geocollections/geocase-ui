# GeoCASe 2.1 – muudatused võrreldes varasema versiooniga

Versioon 2.1 koondab GeoCASe’i kasutajaliidese uuenduse ja ülemineku Nuxt 4-le. Võrdluse aluseks on varasem production-versioon enne development-haru uuenduste ühendamist PR-iga #299. Dokument kirjeldab ka sellele järgnenud meeskonna tutvustuse täiendust; selle jõudmine avalikku portaali sõltub eraldi merge’ist ja deploy’st.

## Avaleht ja navigeerimine

Avaleht sai uue kujunduse, selgemad sissepääsud kogude otsingusse ning asutuste ja andmestike tutvustusse. Otsingu kategooriad hõlmavad fossiile, mineraale, kivimeid, meteoriite ja materjaliproove. Asutuste ja andmestike loendurid lähtuvad vastavatest kataloogidest.

Päis, menüüd ja sisulehed on ühtlustatud. Mobiilivaates on kohandatud navigeerimist, juhtnuppude suurusi ja filtrite kasutamist. Uuendatud on ka tutvustuse, abi, liitumise ja andmestandardite sisu.

## Otsing ja filtrid

- Otsingutulemuste juures on nähtavad aktiivsed filtrid, mida saab ükshaaval eemaldada.
- Filtripaneelis saab aktiivse otsingu lähtestada.
- Täpsed andmeallikafiltrid säilivad URL-is ja otsingus navigeerimisel; toetatud on mitu allikat.
- Andmestikufilter kuvab võimalusel tehnilise aadressi asemel andmestiku nime ning lingi detailvaatesse. Allika aadress on lingi kohtspikris.
- Mobiilis on eraldi sortimisvalik, kohandatud puutealad ning parandatud checkboxide ja sisestusväljade mõõtmeid.
- Tabeli, pildigalerii ja kaardi kasutus on uuendatud ning filtrite ja rippmenüüde kihistus parandatud.

## Kaardid

Otsingukaart töötab koos tabeli ja pildivaatega. Kaardipunktidest saab liikuda lokaliseeritud kirje detailvaatesse. Kui samadel koordinaatidel on mitu kirjet, saab numbriga punktil klõpsates valida avatava kirje.

Dataseti detailvaate kaart laadib jõudluse huvides **kuni 1000 kehtivate koordinaatidega kirjet** ja koondab samade koordinaatidega kirjed brauseris üheks punktiks. Valikuaken kasutab juba laaditud kirjeid ega tee nende kuvamiseks lisapäringut.

Kaardil eristatakse kirjete arvu ja erinevate asukohtade arvu. Näiteks 909 kirjet võib paikneda 65 asukohas. Kui kogu andmestikus on üle 1000 koordinaatidega kirje, ei väljenda laaditud valiku asukohtade arv kogu andmestiku asukohtade koguarvu. Praegune dataseti kaart kasutab kirje ID järgi järjestatud valikut, mitte juhuslikku valimit.

## Kirjete detailvaated ja pildid

Kirjete detailvaade, pildigaleriid ja kaardijuhtnupud on kaasajastatud. Pilte saab sirvida uuendatud galeriis ning pildivaates kasutatakse ajutist pildiga kirjete filtrit. Parandatud on klaviatuuriga juhtimist ja peidetud paneelide avamisel kaardi mõõtmete uuendamist.

## Asutuste kataloog

Lisatud on kataloogipõhine asutuste nimekiri koos otsingu ja detailvaadetega. Asutuse andmed seotakse tema andmestikega ning kogude otsingulingid piiratakse vastavate allikatega.

Detailvaates saab kuvada logo, päisepilti, kirjeldust, seotud andmestikke, kogude pilte ja kaarti. Logod ja päisepildid tulevad JSON-kataloogi väljadest `logo_url` ja `header_url`.

Asutuse logo võib olla PNG või SVG. Kuvamine sõltub ka välise pildiserveri kättesaadavusest ja vahemälust.

## Andmestike kataloog ja detailvaade

Lisatud on otsitav andmestike kataloog ning andmestiku detailvaade:

- Suur eraldi plokk näitab GeoCASe’i indekseeritud kirjete koguarvu. Sellel klõpsamine avab vastava andmestiku otsingutulemused.
- Kirjelduses kasutatakse ka andmeandja pikemat ressursikirjeldust, kui see on olemas ja erineb kataloogi kirjeldusest.
- Kuvatakse litsentsi ja õiguste teave, sealhulgas andmeandja metaandmetest.
- Võimalusel näidatakse andmeandja teatatud kirjete arvu, GeoCASe’i kogutud kirjete arvu ja viimase kogumise aega.
- Näidatakse ressursi nime, allika tunnust, keelt, aadressi, päritolu ja standardi linke, kui vastavad väljad on täidetud.
- Arendajatele mõeldud toormetaandmed jäävad avatavasse eraldi sektsiooni.

Andmeandja teatatud koguarv, kogutud kirjete arv, otsinguindeksi kirjete arv ja kaardil olevate asukohtade arv võivad erineda. Detailvaate selgitused aitavad neid eristada.

## Keeled ja meeskond

Uuendatud on inglise-, eesti- ja saksakeelseid tekste ning säilitatud lokaliseeritud URL-id. Tutvustuslehel on GeoCASe’i tänane meeskond, CETAF-i maateaduste töörühma roll ja viited Berliini varasematele panustajatele.

## Tehnilised muudatused

- Vue CLI asemel kasutatakse Nuxt 4 tööriistu ja failipõhist marsruutimist.
- Rakendus kasutab Vue 3, Pinia olekuhaldust, Nuxt UI-d ja Tailwind CSS-i.
- Tailwindi klassidel on `tw:` prefiks; Vuetify on ühilduvuse jaoks endiselt paigaldatud.
- Nuxt/Nitro server pakub sama päritoluga API-proksisid, kataloogimarsruute ja dünaamilist saidikaarti.
- Docker käivitab Nuxti Node-serveri varasema staatilise Vue CLI väljundi teenindamise asemel.
- Rakendus renderdatakse endiselt brauseris (`ssr: false`).
- Arenduskeskkond kasutab Node 24.22.1 ja npm 11.
- Lisatud ja uuendatud on ühik- ja brauseriteste ning lokaalseid testandmeid.

## Kataloogide uuendamine ja vahemälu

Asutuste ja andmestike JSON-katalooge hoitakse serveri vahemälus **5 minutit**. Pärast aegumist võib esimene päring saada veel vana vastuse, kuni taustal värskeid andmeid laaditakse. Avatud leht ei jälgi JSON-i muudatusi automaatselt.

Logodel ja muudel välistel piltidel võib olla lisaks pikaajaline brauseri või pildiserveri vahemälu. Sama URL-i all faili asendamisel aitab uus failinimi või versiooniparameeter, näiteks `logo.svg?v=2`.

Käivitamise, seadistamise ja kontrollimise juhised on [README-s](README.md).
