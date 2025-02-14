﻿using System.Text.Json.Serialization;

namespace Chats.BE.Controllers.Public.SiteInfos.Dtos;

public record LoginProviderDto
{
    [JsonPropertyName("id")]
    public required int Id { get; init; }

    [JsonPropertyName("key")]
    public required string Key { get; init; }
}
