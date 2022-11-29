from pydantic import BaseModel


class Anfrage(BaseModel):
    vorname: str
    nachname: str
    d_anfrage: str | None = None
    organisation: str | None = ''
    email: str
    strasse: str
    hausnummer: str
    plz: str
    ort: str
    datum: str
    eventdauer: int
    kopfhoerer: int
    sender: int
    anmerkungen: str | None = ''
    akzeptiert: bool = False

class Position(BaseModel):
    pos: int
    text: str
    subtext: str | None = ''
    menge: int | None = 1
    p_einzel: float | None = 0.0
    summe: float | None = None

class Angebot(BaseModel):
    organisation: str | None = ''
    vertreter_vname: str | None = ''
    vertreter_nname: str | None = ''
    strasse: str | None = ''
    hausnummer: str | None = ''
    plz: str | None = ''
    ort: str | None = ''
    d_angebot: str
    d_gueltig_bis: str | None = ''
    d_nutzung_start: str | None = ''
    d_nutzung_end: str | None = ''
    p_reinigung: float | None = ''
    p_kopfhoerer_schaden: float | None = 0.0
    p_kabel_schaden: float | None = 0.0
    p_sender_schaden: float | None = 0.0
    p_summe: float = 0.0
    order: list[Position] | None = None


class Abholung(BaseModel):
  organisation: str | None = ''
  vertreter_vname: str | None = ''
  vertreter_nname: str | None = ''
  strasse: str | None = ''
  hausnummer:  str | None = ''
  plz:  str | None = ''
  ort:  str | None = ''
  date:  str | None = ''
  r_num:  str | None = ''
  d_nutzung_start:  str | None = ''
  p_reinigung: int = 0
  p_kopfhoerer_schaden: int = 0
  p_kabel_schaden: int = 0
  p_sender_schaden: int = 0
  order: list[Position]
  
class Rechnung(BaseModel):
  organisation: str | None = ''
  vertreter_vname: str | None = ''
  vertreter_nname: str | None = ''
  strasse: str | None = ''
  hausnummer:  str | None = ''
  plz: str | None = ''
  ort:  str | None = ''
  deadline: str | None = ''
  date: str | None = ''
  p_summe: int = 0
  r_num: str | None = ''
  zweck: str | None = ''
  order: list[Position]

class Buchung(BaseModel):
    pass