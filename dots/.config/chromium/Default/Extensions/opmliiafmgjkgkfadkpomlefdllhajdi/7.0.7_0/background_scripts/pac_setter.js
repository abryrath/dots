var proxy = function FindProxyForURL(url, host) {
  if ((/bbcfmhds\.vo/)
      .test(host) ||
      (/^cp41752\.edgefcs\.net$/)
      .test(host) ||
      (/^(static|api|ais|webstat|4id|all4nav|static\.bips)\.channel4\.com/)
      .test(host) ||
      (/bbc\.co\.uk\/mobile\/apps\/iplayer/)
      .test(url) ||
      (/itv\.com\/ukonly/)
      .test(url) ||
      (/^(magni|ned|ted|mercury|tom|mediaplayer|secure-mercury)\.itv\.com$/)
      .test(host) ||
      (/bbci\.co\.uk/)
      .test(host) ||
      (/bbc\.co\.uk/)
      .test(host) ||
      (/^(ic)\.c4assets\.com/)
      .test(host) ||
      (/www\.channel4\.com$/)
      .test(host) ||
      (/bbcmedia\.fcod/)
      .test(host) ||
      (/\/idle\/[a-zA-Z0-9\-_]{16}\//)
      .test(url) ||
      (/\/send\/[a-zA-Z0-9\-_]{16}\//)
      .test(url) ||
      (/londonlive\.co\.uk$/)
      .test(host) ||
      (/vs-hds-uk-live/)
      .test(url) ||
      (/^(www\.)?tvcatchup\.com$/)
      .test(host) ||
      (/^iplayertokfs\.fplive\.net$/)
      .test(host) ||
      (/\.nowtv\.com$/)
      .test(host) ||
      (/^(player|skyid|payments)\.sky\.com$/)
      .test(host) ||
      ((/\.optimizely\.com$/)
          .test(host) && (/geo2\.js$/)
          .test(url)) ||
      (/^dvnnowtvprod\-ls\.akamaihd\.net$/)
      .test(host) ||
      ((/^(admin|c)\.brightcove\.com$/)
          .test(host) &&
          (/19582164001|1707001744001|1779174286001|1422653978568|4006647773001|aljazeera_EN|1413813980721|TVGOQ5ZTwJYW4Aj2VxnKEXntSbmcf9ZQ/)
          .test(url)) ||
      (/^(as|ve|vod|aod)\-hds\-uk\-live\.edgesuite\.net$/)
      .test(host) ||
      (/^(as|ve|vod|aod)\-hds\-uk\-live\.bbcfmt\.vo\.llnwd\.net$/)
      .test(host) ||
      (/^(www\.|live\.cdn\.)?tvplayer\.com$/)
      .test(host) ||
      (/^(cassie|deliver\-hls)\.channel5\.com$/)
      .test(host) ||
      (/^aod\-pod\-uk\-live\.bbcfmt\.vo\.llnwd\.net$/)
      .test(host) ||
      (/^(as|ve|vod|vs|aod)\-dash\-uk\-live\.akamaized\.net$/)
      .test(host) ||
      (/^(as|ve|vod|vs|aod)\-hds\-uk\-live\.akamaized\.net$/)
      .test(host) ||
      (/^(as|ve|vod|vs|aod)\-thumb\-uk\-live\.bbcfmt\.vo\.llnwd\.net$/)
      .test(host) ||
      (/^(as|ve|vod|vs|aod)\-thumb\-uk\-live\.bbcfmt\.hs\.llnwd\.net$/)
      .test(host) ||
      (/^(as|ve|vod|vs|aod)\-dash\-uk\-live\.bbcfmt\.hs\.llnwd\.net$/)
      .test(host) ||
      (/^(as|ve|vod|vs|aod)\-sub\-uk\-live\.bbcfmt\.hs\.llnwd\.net$/)
      .test(host) ||
      (/^(as|ve|vod|vs|aod)\-sub\-uk\-live\.akamaized\.net$/)
      .test(host) ||
      (/^open\.live\.bbc\.co\.uk$/)
      .test(host) ||
      (/^aod\-pod\-uk\-live\.edgesuite\.net$/)
      .test(host) ||
      (/hls\.channel5\.com$/)
      .test(host)) {
        return "PROXY bbc1.beebs.host:8080; PROXY bbc2.beebs.host:80; PROXY bbc3.beebs.host:80; PROXY bbc4.beebs.host:8080;";
    } else {
        return "DIRECT";
    }
}
localStorage.pacScript = proxy
