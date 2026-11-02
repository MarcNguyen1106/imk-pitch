# Usage: python3 scripts/grid.py out.png still1 still2 ... (names without .png, in out/stills)
import sys
from PIL import Image
out=sys.argv[1]; names=sys.argv[2:]
cols=2; w,h=960,540
rows=(len(names)+cols-1)//cols
sheet=Image.new('RGB',(cols*w,rows*h),(0,0,0))
for i,n in enumerate(names):
    im=Image.open(f'out/stills/{n}.png').convert('RGB').resize((w,h),Image.LANCZOS)
    sheet.paste(im,((i%cols)*w,(i//cols)*h))
sheet.save(out)
