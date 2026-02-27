# 创建目录
New-Item -ItemType Directory -Path "static\img\items" -Force

# 下载图片
$images = @(
    @{ Name = "record_11.png"; URL = "https://raw.githubusercontent.com/Mojang/bedrock-samples/refs/heads/main/resource_pack/textures/items/record_11.png" },
    @{ Name = "record_13.png"; URL = "https://raw.githubusercontent.com/Mojang/bedrock-samples/refs/heads/main/resource_pack/textures/items/record_13.png" },
    @{ Name = "music_disc_5.png"; URL = "https://raw.githubusercontent.com/Mojang/bedrock-samples/refs/heads/main/resource_pack/textures/items/music_disc_5.png" },
    @{ Name = "record_blocks.png"; URL = "https://raw.githubusercontent.com/Mojang/bedrock-samples/refs/heads/main/resource_pack/textures/items/record_blocks.png" },
    @{ Name = "record_cat.png"; URL = "https://raw.githubusercontent.com/Mojang/bedrock-samples/refs/heads/main/resource_pack/textures/items/record_cat.png" },
    @{ Name = "music_disc_creator.png"; URL = "https://raw.githubusercontent.com/Mojang/bedrock-samples/refs/heads/main/resource_pack/textures/items/music_disc_creator.png" },
    @{ Name = "music_disc_creator_music_box.png"; URL = "https://raw.githubusercontent.com/Mojang/bedrock-samples/refs/heads/main/resource_pack/textures/items/music_disc_creator_music_box.png" },
    @{ Name = "record_mall.png"; URL = "https://raw.githubusercontent.com/Mojang/bedrock-samples/refs/heads/main/resource_pack/textures/items/record_mall.png" },
    @{ Name = "record_mellohi.png"; URL = "https://raw.githubusercontent.com/Mojang/bedrock-samples/refs/heads/main/resource_pack/textures/items/record_mellohi.png" },
    @{ Name = "music_disc_otherside.png"; URL = "https://raw.githubusercontent.com/Mojang/bedrock-samples/refs/heads/main/resource_pack/textures/items/music_disc_otherside.png" },
    @{ Name = "music_disc_pigstep.png"; URL = "https://raw.githubusercontent.com/Mojang/bedrock-samples/refs/heads/main/resource_pack/textures/items/music_disc_pigstep.png" },
    @{ Name = "music_disc_precipice.png"; URL = "https://raw.githubusercontent.com/Mojang/bedrock-samples/refs/heads/main/resource_pack/textures/items/music_disc_precipice.png" },
    @{ Name = "music_disc_relic.png"; URL = "https://raw.githubusercontent.com/Mojang/bedrock-samples/refs/heads/main/resource_pack/textures/items/music_disc_relic.png" },
    @{ Name = "record_stal.png"; URL = "https://raw.githubusercontent.com/Mojang/bedrock-samples/refs/heads/main/resource_pack/textures/items/record_stal.png" },
    @{ Name = "record_strad.png"; URL = "https://raw.githubusercontent.com/Mojang/bedrock-samples/refs/heads/main/resource_pack/textures/items/record_strad.png" },
    @{ Name = "record_wait.png"; URL = "https://raw.githubusercontent.com/Mojang/bedrock-samples/refs/heads/main/resource_pack/textures/items/record_wait.png" },
    @{ Name = "record_ward.png"; URL = "https://raw.githubusercontent.com/Mojang/bedrock-samples/refs/heads/main/resource_pack/textures/items/record_ward.png" },
    @{ Name = "record_chirp.png"; URL = "https://raw.githubusercontent.com/Mojang/bedrock-samples/refs/heads/main/resource_pack/textures/items/record_chirp.png" },
    @{ Name = "record_far.png"; URL = "https://raw.githubusercontent.com/Mojang/bedrock-samples/refs/heads/main/resource_pack/textures/items/record_far.png" },
    @{ Name = "music_disc_tears.png"; URL = "https://raw.githubusercontent.com/Mojang/bedrock-samples/refs/heads/main/resource_pack/textures/items/music_disc_tears.png" },
    @{ Name = "music_disc_lava_chicken.png"; URL = "https://raw.githubusercontent.com/Mojang/bedrock-samples/refs/heads/main/resource_pack/textures/items/music_disc_lava_chicken.png" }
)

foreach ($image in $images) {
    $outputPath = "static\img\items\$($image.Name)"
    Write-Host "下载 $($image.Name)..."
    Invoke-WebRequest -Uri $image.URL -OutFile $outputPath
}

# 检查目录中的文件
Write-Host "\n下载完成！目录中的文件："
Get-ChildItem "static\img\items"