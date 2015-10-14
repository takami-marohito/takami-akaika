1.python3を入れる  
2.cd でこのディレクトリに移動  
3.linuxならpython3 -m http.server 8000, windowsならpython -m http.server 8000  
4.ブラウザでlocalhost:8000

python2ならpython -m SimpleHTTPServer 8000

計算済みのデータを読み込むことができる
データは単にfloatをカンマ区切りと改行で並べるだけ

地形データの入ったjsonファイルを読み込んで、地形を描画している(function draw_land)