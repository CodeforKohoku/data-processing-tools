# -*- coding: utf-8 -*-

import csv


def csv2geojson(input, encoding=None):
    """CSV をインプットにして、GeoJSON として書き出し可能な ``dict`` 形式に変換する

    :param input: インプットの CSV ファイル名
    """
    if isinstance(input, (str, bytes)):
        with open(input, 'r', encoding=encoding or 'CP932') as fin:
            return csv2geojson(fin)
    reader = csv.DictReader(input)
    fields = ("HID", "Type", "Kodomo", "Name", "Label", "AgeS", "AgeE",
              "Full", "Open", "Close", "H24", "Memo", "Extra", "Extra_type",
              "設立年度", "プレ幼稚園", "園バス", "給食", "Temp", "Holiday",
              "Night", "Add1", "Add2", "TEL", "FAX", "Owner", "Ownership",
              "Proof", "Shanai", "Y", "X", "url", "Vacancy", "VacancyDate")
    data = {'type': 'FeatureCollection', "crs": {
        "type": "name",
        "properties": {
            "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
        }
    }}
    a = []
    for d in reader:
        a.append({'properties': {
            k: d[k] if k in d else None for k
            in fields
        }, "type": "Feature", "geometry": {
            "type": "Point", "coordinates": [float(d['X']), float(d['Y'])]
        }})
    data['features'] = a
    return data
