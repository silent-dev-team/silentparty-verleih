import requests

class Directus:
  def __init__(self, url:str):
    self.url = self._validate_url(url)
  
  def import_file(self, url:str, title:str=None) -> dict:
    """Uses the automatic import of directus
    Args:
        url (str): url from wich directus should import a files
    Returns:
        dict: returns the message from directus
    """
    payload: dict = {
      'url': url,
      'data': {}
    }
    if title:
      payload['data']['title'] = title
    
    r = requests.post(
        url = self.url + '/files/import',
        json = payload
    )
    try:
      return r.json()
    except:
      return {'message':'no response from directus (means "OK")'}
  
  def _validate_url(self, url:str):
    https:str = 'https://'
    http:str  = 'http://'
    url = url[:-1] if url[-1] == '/' else url
    url = https + url if https not in url else url.replace(http, https)
    return url
  
class Collection:
  pass

