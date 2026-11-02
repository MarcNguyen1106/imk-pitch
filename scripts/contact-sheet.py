# Builds out/stills/contact-sheet.png from the state stills listed in out/states.json.
import json
from PIL import Image, ImageDraw
jobs=json.load(open('out/states.json'))
cols=5; w,h=480,270; pad=34
rows=(len(jobs)+cols-1)//cols
sheet=Image.new('RGB',(cols*w,rows*(h+pad)),(18,11,8))
d=ImageDraw.Draw(sheet)
for i,j in enumerate(jobs):
    im=Image.open(f"out/stills/{j['name']}.png").convert('RGB').resize((w,h),Image.LANCZOS)
    x=(i%cols)*w; y=(i//cols)*(h+pad)
    sheet.paste(im,(x,y+pad))
    t=j['frame']/30
    d.text((x+8,y+10),f"{j['name']}  {int(t//60)}:{t%60:04.1f}",fill=(242,169,59))
sheet.save('out/stills/contact-sheet.png')
print('contact sheet', sheet.size)
