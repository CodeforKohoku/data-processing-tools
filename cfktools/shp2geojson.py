# -*- coding: utf-8 -*-

import os
import json
import csv
import re

import fiona
from fiona.crs import to_string


def shp2geojson(input_, filter_=None, preprocess_=None):
    """``shp`` ファイルを入力にして、jsonとして書き出し可能な ``dict`` にする

    :param input: shp ファイルか``fiona``オブジェクト
    :param filter: feature に対するフィルタ
    :param preprocess: feature に掛ける前処理
    """
    if isinstance(input_, (str, bytes)):
        with fiona.open(input_) as fin:
            return shp2geojson(fin, filter_, preprocess_)
    a = {
        'type': 'FeatureCollection',
        'crs': {
            'type': 'name',
            'properties': {
                'name': 'urn:ogc:def:crs:OGC:1.3:CRS84'
            }
        }
    }
    a['features'] = []
    if filter_ is None:
        if preprocess_ is None:
            a['features'] = list(input_)
        else:
            a['features'] = [preprocess_(f) for f in input_]
    else:
        if preprocess_ is None:
            a['features'] = [f for f in input_ if filter_(f)]
        else:
            a['features'] = [preprocess_(f) for f in input_ if filter_(f)]
    return a


def shp2Elementary(input_):
    pattern = r'港北区'

    def pp(f):
        f['properties']['name'] = f['properties']['A27_007']
        f['properties']['address'] = f['properties']['A27_008']
        return f

    return shp2geojson(
        input_,
        filter_=lambda x:
            'properties' in x and
            'A27_008' in x['properties'] and
            'A27_007' in x['properties'] and
            re.search(pattern, x['properties']['A27_008']) is not None,
        preprocess_=pp
    )


def shp2loc(input_, target_code):
    codes = ('P29_001', 'P29_002', 'P29_003', 'P29_004')
    dics = {}
    for code in codes:
        with open(
                os.path.join(
                    os.path.dirname(__file__),
                    'dics',
                    code + '.tsv'
                ), 'r', encoding='utf-8') as codein:
            reader = csv.reader(codein, delimiter='\t')
            next(reader)
            dics[code] = {d[0]: d[1] for d in reader}

    def ff(f):
        return 'properties' in f and\
            'P29_001' in f['properties'] and\
            f['properties']['P29_001'] == '14109' and\
            'P29_003' in f['properties'] and\
            f['properties']['P29_003'] == target_code

    def pp(f):
        for k, v in dics.items():
            f['properties'][k] = v[f['properties'][k]]
        f['properties']['address'] = f['properties']['P29_001'] +\
            f['properties']['P29_006']
        f['properties']['name'] = f['properties']['P29_005']
        f['properties']['label'] = f['properties']['P29_005']
        f['properties']['x'] = f['geometry']['coordinates'][0]
        f['properties']['y'] = f['geometry']['coordinates'][1]
        return f

    return shp2geojson(input_, filter_=ff, preprocess_=pp)


def shp2Elementary_loc(input_):
    return shp2loc(input_, '16001')


def shp2MiddleSchool_loc(input_):
    return shp2loc(input_, '16002')


def shp2MiddleSchool(input_):
    pattern = r'港北区'

    def pp(f):
        f['properties']['name'] = f['properties']['A32_003']
        f['properties']['address'] = f['properties']['A32_002']
        return f

    return shp2geojson(
        input_,
        filter_=lambda x:
            'properties' in x and
            'A32_002' in x['properties'] and
            'A32_003' in x['properties'] and
            re.search(pattern, x['properties']['A32_002']) is not None,
        preprocess_=pp
    )
