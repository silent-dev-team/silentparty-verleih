export type Order = {
  id:                    string;
  status:                string;
  user_created:          string;
  date_created:          Date;
  user_updated:          string;
  date_updated:          Date;
  offer:                 string;
  start:                 Date;
  end:                   Date;
  tarif:                 string;
  vorname:               string;
  nachname:              string;
  organisation:          string;
  strasse:               string;
  hausnummer:            string;
  plz:                   string;
  ort:                   string;
  rechnung:              string;
  offer_doc:             null;
  r_num:                 string;
  mail:                  null;
  requested_headphones:  number;
  requested_transmitter: number;
}

export type Offer = {
  id:              string;
  user_created:    string;
  date_created:    Date;
  user_updated:    Date;
  date_updated:    Date;
  n_headphones:    number;
  n_transmitter:   number;
  p_hp:            string;
  p_hp_reinigung:  string;
  p_hp_schaden:    string;
  pauschale:       number;
  p_tm:            number;
  p_tm_schaden:    number;
  p_kabel_schaden: number;
}

export type Box = {
  id:           string;
  user_created: Date;
  date_created: Date;
  user_updated: Date;
  date_updated: Date;
  qr:           string;
  headphones:   string[];
}

export type Headphone = {
  id:           string;
  status:       'ok'|'defect'|'lost';
  user_created: Date;
  date_created: Date;
  user_updated: Date;
  date_updated: Date;
  qr:           string;
  box:          string;
}