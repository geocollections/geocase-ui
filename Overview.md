Small overview of GeoCASe tech stack

- UI app at https://geocase.eu which is built using vue.js framework
- API at https://api.geocase.eu which is a small node.js app built using [express](https://expressjs.com/) framework

Firstly, all the data is harvested and processed using [B-HIT](https://wiki.bgbm.org/bhit/index.php/Main_Page) 
which is a Berlin Harvesting and Indexing Toolkit. Basically how it works is that different
institutions either setup their own providers and then B-HIT fetches data from the endpoints
or we use a raw data file like an excel. 

After the harvesting B-HIT adds data to the database and creates all the necessary tables, fields etc.
In our stack B-HIT works like a black box, we add the endpoints and setup schedules
but we can't control how the data is processed or how the standards are checked.

Next off we are indexing the data using [Apache Solr](https://solr.apache.org/) which is basically a super
fast and powerful search platform. All the data we are using in [GeoCASe](https://geocase.eu) can be fetched
from https://api.geocase.eu/v1/solr?q=* endpoint.

Some smaller services:
- Front page heatmap is generated using TileServer GL https://map.geocase.eu/
- In case of images we are generating small thumbnails and serving them directly from https://images.geocase.eu/{filename}
- Prerendering which lets search bots crawl out site and index it properly

[Matomo](https://matomo.org/) is used for analytics. 
