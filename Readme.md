# Verleih-Services

## Struktur
In diesem Projekt sind alle Services rund um den Verleih der Kopfhörer.

- ```backup```: Service mit REST-API, um snapshots von Directus machen zu können
- ```extensions```: Hier sammeln sich alle Extensions 
- ```from```: beinhaltet die Form unter https://verleih.silentparty-hannover.de 
- ```service```: der alte Servie mit dem alten Templater und Telegram-Bot 
- ```templates```: Hier ist Platz für die Mails, die Driectus versenden soll
- ```WarehouseManager```: Vue-App für die Verwaltung der Kopfhörer 

## Starten des Projekts

Wenn ihr docker und docker-compose installiert habt, könnt ihr einfach eine lokale Kopie des Projekts mit ```docker-compose up --build``` starten.

