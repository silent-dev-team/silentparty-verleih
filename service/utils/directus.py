import requests, logging

class Directus:
  def __init__(self, url:str, token:str=None):
    self.url = self._validate_url(url)
    self.token = token
    self._authSufix:str = '?access_token='+token if token else ''

  def get_item(self, id:int|str, collection_name:str) -> dict:
    r = requests.get(f'{self.url}/content/{collection_name}'+ self._authSufix)
    try:
      item:dict = r.json()
      return item
    except ValueError:
      logging.error('fail to get item')
      return
    
  def get_file(self):
    pass
  
  def import_file(self, url:str, title:str=None, folder:str=None) -> dict:
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
    if folder:
      payload['data']['folder'] = folder
    
    r = requests.post(
        url   = self._url('/files/import'),
        json  = payload
    )
    try:
      return r.json()
    except:
      return {'message':'no reading permissions'}
  
  def _url(self, route:str) -> str:
    return self.url + route + self._authSufix
  
  def _validate_url(self, url:str) -> str:
    https:str = 'https://'
    http:str  = 'http://'
    url = url[:-1] if url[-1] == '/' else url
    url = https + url if https not in url else url.replace(http, https)
    return url
