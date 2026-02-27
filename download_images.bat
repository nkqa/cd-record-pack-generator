@echo off

set "targetDir=D:\cdpack\web\web\static\img\items"

mkdir "%targetDir%" 2>nul

echo 开始下载图片...

curl -o "%targetDir%\record_11.png" "https://raw.githubusercontent.com/Mojang/bedrock-samples/refs/heads/main/resource_pack/textures/items/record_11.png"
curl -o "%targetDir%\record_13.png" "https://raw.githubusercontent.com/Mojang/bedrock-samples/refs/heads/main/resource_pack/textures/items/record_13.png"
curl -o "%targetDir%\music_disc_5.png" "https://raw.githubusercontent.com/Mojang/bedrock-samples/refs/heads/main/resource_pack/textures/items/music_disc_5.png"
curl -o "%targetDir%\record_blocks.png" "https://raw.githubusercontent.com/Mojang/bedrock-samples/refs/heads/main/resource_pack/textures/items/record_blocks.png"
curl -o "%targetDir%\record_cat.png" "https://raw.githubusercontent.com/Mojang/bedrock-samples/refs/heads/main/resource_pack/textures/items/record_cat.png"
curl -o "%targetDir%\music_disc_creator.png" "https://raw.githubusercontent.com/Mojang/bedrock-samples/refs/heads/main/resource_pack/textures/items/music_disc_creator.png"
curl -o "%targetDir%\music_disc_creator_music_box.png" "https://raw.githubusercontent.com/Mojang/bedrock-samples/refs/heads/main/resource_pack/textures/items/music_disc_creator_music_box.png"
curl -o "%targetDir%\record_mall.png" "https://raw.githubusercontent.com/Mojang/bedrock-samples/refs/heads/main/resource_pack/textures/items/record_mall.png"
curl -o "%targetDir%\record_mellohi.png" "https://raw.githubusercontent.com/Mojang/bedrock-samples/refs/heads/main/resource_pack/textures/items/record_mellohi.png"
curl -o "%targetDir%\music_disc_otherside.png" "https://raw.githubusercontent.com/Mojang/bedrock-samples/refs/heads/main/resource_pack/textures/items/music_disc_otherside.png"
curl -o "%targetDir%\music_disc_pigstep.png" "https://raw.githubusercontent.com/Mojang/bedrock-samples/refs/heads/main/resource_pack/textures/items/music_disc_pigstep.png"
curl -o "%targetDir%\music_disc_precipice.png" "https://raw.githubusercontent.com/Mojang/bedrock-samples/refs/heads/main/resource_pack/textures/items/music_disc_precipice.png"
curl -o "%targetDir%\music_disc_relic.png" "https://raw.githubusercontent.com/Mojang/bedrock-samples/refs/heads/main/resource_pack/textures/items/music_disc_relic.png"
curl -o "%targetDir%\record_stal.png" "https://raw.githubusercontent.com/Mojang/bedrock-samples/refs/heads/main/resource_pack/textures/items/record_stal.png"
curl -o "%targetDir%\record_strad.png" "https://raw.githubusercontent.com/Mojang/bedrock-samples/refs/heads/main/resource_pack/textures/items/record_strad.png"
curl -o "%targetDir%\record_wait.png" "https://raw.githubusercontent.com/Mojang/bedrock-samples/refs/heads/main/resource_pack/textures/items/record_wait.png"
curl -o "%targetDir%\record_ward.png" "https://raw.githubusercontent.com/Mojang/bedrock-samples/refs/heads/main/resource_pack/textures/items/record_ward.png"
curl -o "%targetDir%\record_chirp.png" "https://raw.githubusercontent.com/Mojang/bedrock-samples/refs/heads/main/resource_pack/textures/items/record_chirp.png"
curl -o "%targetDir%\record_far.png" "https://raw.githubusercontent.com/Mojang/bedrock-samples/refs/heads/main/resource_pack/textures/items/record_far.png"
curl -o "%targetDir%\music_disc_tears.png" "https://raw.githubusercontent.com/Mojang/bedrock-samples/refs/heads/main/resource_pack/textures/items/music_disc_tears.png"
curl -o "%targetDir%\music_disc_lava_chicken.png" "https://raw.githubusercontent.com/Mojang/bedrock-samples/refs/heads/main/resource_pack/textures/items/music_disc_lava_chicken.png"

echo 下载完成！
pause