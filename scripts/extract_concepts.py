from sets import Set
from xml.dom import minidom
from datetime import datetime
import uuid
import os

concepts = []
for file in os.listdir("./"):
    if file.endswith(".xml"):
        xml = minidom.parse(file)
        for element in xml.getElementsByTagName('Element'):
            try:
                concepts.append(element.attributes['concept'].value)
            except KeyError:
                print "No concept for {} in {}".format(element.attributes['type'].value, file)

print len(concepts)
concepts = Set(concepts)

with open("concepts.csv", 'w+') as f:
    rowstring = "{},{},{},{},{},{},{},{},{}\n"
    f.write(rowstring.format("created","last_modified","uuid","name","display_name","description","data_type","mime_type","constraint"))
    for concept in concepts:
        f.write(rowstring.format(datetime.now(), datetime.now(), uuid.uuid4(), concept, concept, "", "", "", ""))
    f.truncate()
