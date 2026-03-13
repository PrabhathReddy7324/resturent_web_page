import docx
doc = docx.Document('d:/resturent/Restaurant_SRS_Document.docx')
with open('srs.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join([p.text for p in doc.paragraphs]))
