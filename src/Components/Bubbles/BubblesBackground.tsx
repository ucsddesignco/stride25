import { useState, useEffect } from 'react';

export default function BubblesBackground() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(typeof window !== 'undefined' && window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) {
    return (
      <svg
        width="1256"
        height="1226"
        viewBox="0 0 1256 1226"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <g style={{ mixBlendMode: 'multiply' }} opacity="0.1">
          <path
            d="M810.755 331.915L762.139 150.49L1079.74 206.712L889.119 1043.97L338.11 940.382L705.017 582.557L729.975 396.846L810.755 331.915Z"
            fill="url(#paint0_linear_6684_2396)"
          />
          <path
            d="M1050.01 337.301L810.755 331.915L762.139 150.49L1079.74 206.712L1050.01 337.301Z"
            fill="url(#paint1_linear_6684_2396)"
          />
          <path
            d="M558.436 978.17L705.017 582.557L338.11 940.382L558.436 978.17Z"
            fill="url(#paint2_linear_6684_2396)"
          />
          <path
            d="M889.119 1043.97L705.018 582.557L729.975 396.846L1002.42 546.321L889.119 1043.97Z"
            fill="url(#paint3_linear_6684_2396)"
          />
        </g>

        <g style={{ mixBlendMode: 'multiply' }} opacity="0.1">
          <path
            d="M616.428 796.876L788.124 873.028L544.855 1084.81L13.1981 410.512L439.952 46.8884L487.848 557.149L616.659 693.235L616.428 796.876Z"
            fill="url(#paint4_linear_6684_2396)"
          />
          <path
            d="M461.932 979.639L616.428 796.877L788.124 873.028L544.855 1084.81L461.932 979.639Z"
            fill="url(#paint5_linear_6684_2396)"
          />
          <path
            d="M272.137 194.569L487.848 557.149L439.952 46.8884L272.137 194.569Z"
            fill="url(#paint6_linear_6684_2396)"
          />
          <path
            d="M13.198 410.512L487.848 557.149L616.658 693.235L329.204 811.301L13.198 410.512Z"
            fill="url(#paint7_linear_6684_2396)"
          />
        </g>

        <path
          d="M922.14 308.19L860.346 83.0127L1255.59 150.532L1024.88 1192.8L339.113 1068.14L792.564 620.568L822.202 389.513L922.14 308.19Z"
          fill="url(#paint8_linear_6684_2396)"
        />
        <path
          d="M1219.61 313.097L922.139 308.19L860.346 83.0128L1255.59 150.532L1219.61 313.097Z"
          fill="url(#paint9_linear_6684_2396)"
        />
        <path
          d="M613.297 1113.47L792.564 620.568L339.114 1068.14L613.297 1113.47Z"
          fill="url(#paint10_linear_6684_2396)"
        />
        <path
          d="M1024.88 1192.8L792.564 620.568L822.201 389.513L1162.01 573.299L1024.88 1192.8Z"
          fill="url(#paint11_linear_6684_2396)"
        />
        <path
          d="M327.289 330.692L413.388 113.643L13.1201 137.441L128.224 1198.72L823.521 1149.96L421.851 655.388L417.713 422.477L327.289 330.692Z"
          fill="url(#paint12_linear_6684_2396)"
        />
        <path
          d="M31.0734 302.97L327.29 330.692L413.388 113.643L13.1204 137.441L31.0734 302.97Z"
          fill="url(#paint13_linear_6684_2396)"
        />
        <path
          d="M546.022 1164.97L421.851 655.389L823.521 1149.96L546.022 1164.97Z"
          fill="url(#paint14_linear_6684_2396)"
        />
        <path
          d="M128.225 1198.72L421.852 655.388L417.714 422.477L59.8091 567.916L128.225 1198.72Z"
          fill="url(#paint15_linear_6684_2396)"
        />

        <defs>
          <linearGradient
            id="paint0_linear_6684_2396"
            x1="737.528"
            y1="269.457"
            x2="970.913"
            y2="985.458"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#28526F" />
            <stop offset="1" stopColor="#0B273E" />
          </linearGradient>

          <linearGradient
            id="paint1_linear_6684_2396"
            x1="678.776"
            y1="208.645"
            x2="873.468"
            y2="386.204"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#88AFC0" />
            <stop offset="1" stopColor="#22506B" />
          </linearGradient>

          <linearGradient
            id="paint2_linear_6684_2396"
            x1="795.731"
            y1="276.521"
            x2="527.501"
            y2="945.553"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#437C9E" />
            <stop offset="1" stopColor="#032339" />
          </linearGradient>

          <linearGradient
            id="paint3_linear_6684_2396"
            x1="875.662"
            y1="430.015"
            x2="921.971"
            y2="1051.86"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#3D7394" />
            <stop offset="1" stopColor="#13242E" />
          </linearGradient>

          <linearGradient
            id="paint4_linear_6684_2396"
            x1="711.025"
            y1="779.141"
            x2="7.33689"
            y2="510.91"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#28526F" />
            <stop offset="1" stopColor="#0B273E" />
          </linearGradient>

          <linearGradient
            id="paint5_linear_6684_2396"
            x1="795.248"
            y1="771.635"
            x2="534.792"
            y2="811.563"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#88AFC0" />
            <stop offset="1" stopColor="#22506B" />
          </linearGradient>

          <linearGradient
            id="paint6_linear_6684_2396"
            x1="668.965"
            y1="819.987"
            x2="316.948"
            y2="190.992"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#437C9E" />
            <stop offset="1" stopColor="#032339" />
          </linearGradient>

          <linearGradient
            id="paint7_linear_6684_2396"
            x1="499.327"
            y1="785.746"
            x2="-13.5808"
            y2="431.114"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#3D7394" />
            <stop offset="1" stopColor="#13242E" />
          </linearGradient>

          <linearGradient
            id="paint8_linear_6684_2396"
            x1="830.64"
            y1="231.092"
            x2="1126.13"
            y2="1119.45"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#28526F" />
            <stop offset="1" stopColor="#0B273E" />
          </linearGradient>

          <linearGradient
            id="paint9_linear_6684_2396"
            x1="757.147"
            y1="155.932"
            x2="1000.51"
            y2="375.211"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#88AFC0" />
            <stop offset="1" stopColor="#22506B" />
          </linearGradient>

          <linearGradient
            id="paint10_linear_6684_2396"
            x1="903.047"
            y1="239.439"
            x2="574.596"
            y2="1073.16"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#437C9E" />
            <stop offset="1" stopColor="#032339" />
          </linearGradient>

          <linearGradient
            id="paint11_linear_6684_2396"
            x1="1003.56"
            y1="429.658"
            x2="1065.78"
            y2="1202.37"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#3D7394" />
            <stop offset="1" stopColor="#13242E" />
          </linearGradient>

          <linearGradient
            id="paint12_linear_6684_2396"
            x1="426.687"
            y1="264.086"
            x2="35.6264"
            y2="1114.71"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#28526F" />
            <stop offset="1" stopColor="#0B273E" />
          </linearGradient>

          <linearGradient
            id="paint13_linear_6684_2396"
            x1="507.974"
            y1="197.432"
            x2="242.05"
            y2="388.721"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#88AFC0" />
            <stop offset="1" stopColor="#22506B" />
          </linearGradient>

          <linearGradient
            id="paint14_linear_6684_2396"
            x1="353.801"
            y1="264.447"
            x2="588.908"
            y2="1129.14"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#437C9E" />
            <stop offset="1" stopColor="#032339" />
          </linearGradient>

          <linearGradient
            id="paint15_linear_6684_2396"
            x1="233.047"
            y1="442.505"
            x2="86.5234"
            y2="1203.74"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#3D7394" />
            <stop offset="1" stopColor="#13242E" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  return (
    <svg
      width="1706"
      height="1226"
      viewBox="0 0 1706 1226"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <g style={{ mixBlendMode: 'multiply' }} opacity="0.1">
        <path
          d="M1260.75 331.915L1212.14 150.49L1529.74 206.712L1339.12 1043.97L788.107 940.382L1155.01 582.557L1179.97 396.846L1260.75 331.915Z"
          fill="url(#paint0_linear_6644_1231)"
        />
        <path
          d="M1500.01 337.301L1260.75 331.915L1212.14 150.49L1529.74 206.712L1500.01 337.301Z"
          fill="url(#paint1_linear_6644_1231)"
        />
        <path
          d="M1008.43 978.17L1155.01 582.557L788.107 940.382L1008.43 978.17Z"
          fill="url(#paint2_linear_6644_1231)"
        />
        <path
          d="M1339.12 1043.97L1155.01 582.557L1179.97 396.846L1452.42 546.321L1339.12 1043.97Z"
          fill="url(#paint3_linear_6644_1231)"
        />
      </g>

      <g style={{ mixBlendMode: 'multiply' }} opacity="0.1">
        <path
          d="M616.428 796.877L788.124 873.029L544.856 1084.81L13.1983 410.512L439.952 46.8888L487.849 557.149L616.659 693.236L616.428 796.877Z"
          fill="url(#paint4_linear_6644_1231)"
        />
        <path
          d="M461.932 979.639L616.428 796.877L788.124 873.028L544.856 1084.81L461.932 979.639Z"
          fill="url(#paint5_linear_6644_1231)"
        />
        <path
          d="M272.137 194.57L487.849 557.149L439.952 46.8889L272.137 194.57Z"
          fill="url(#paint6_linear_6644_1231)"
        />
        <path
          d="M13.1982 410.512L487.849 557.149L616.659 693.236L329.204 811.301L13.1982 410.512Z"
          fill="url(#paint7_linear_6644_1231)"
        />
      </g>

      <path
        d="M1372.14 308.19L1310.34 83.0127L1705.59 150.532L1474.88 1192.8L789.111 1068.14L1242.56 620.568L1272.2 389.513L1372.14 308.19Z"
        fill="url(#paint8_linear_6644_1231)"
      />
      <path
        d="M1669.61 313.097L1372.14 308.19L1310.34 83.0128L1705.59 150.532L1669.61 313.097Z"
        fill="url(#paint9_linear_6644_1231)"
      />
      <path
        d="M1063.29 1113.47L1242.56 620.569L789.111 1068.14L1063.29 1113.47Z"
        fill="url(#paint10_linear_6644_1231)"
      />
      <path
        d="M1474.88 1192.8L1242.56 620.568L1272.2 389.513L1612.01 573.299L1474.88 1192.8Z"
        fill="url(#paint11_linear_6644_1231)"
      />
      <path
        d="M327.276 330.692L413.375 113.643L13.1071 137.441L128.211 1198.72L823.508 1149.96L421.838 655.388L417.7 422.477L327.276 330.692Z"
        fill="url(#paint12_linear_6644_1231)"
      />
      <path
        d="M31.0605 302.97L327.277 330.692L413.375 113.643L13.1075 137.441L31.0605 302.97Z"
        fill="url(#paint13_linear_6644_1231)"
      />
      <path
        d="M546.009 1164.97L421.839 655.389L823.508 1149.96L546.009 1164.97Z"
        fill="url(#paint14_linear_6644_1231)"
      />
      <path
        d="M128.211 1198.72L421.838 655.388L417.7 422.477L59.7959 567.916L128.211 1198.72Z"
        fill="url(#paint15_linear_6644_1231)"
      />

      <defs>
        <linearGradient
          id="paint0_linear_6644_1231"
          x1="1187.53"
          y1="269.457"
          x2="1420.91"
          y2="985.458"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#28526F" />
          <stop offset="1" stopColor="#0B273E" />
        </linearGradient>

        <linearGradient
          id="paint1_linear_6644_1231"
          x1="1128.77"
          y1="208.645"
          x2="1323.46"
          y2="386.204"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#88AFC0" />
          <stop offset="1" stopColor="#22506B" />
        </linearGradient>

        <linearGradient
          id="paint2_linear_6644_1231"
          x1="1245.73"
          y1="276.521"
          x2="977.498"
          y2="945.553"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#437C9E" />
          <stop offset="1" stopColor="#032339" />
        </linearGradient>

        <linearGradient
          id="paint3_linear_6644_1231"
          x1="1325.66"
          y1="430.015"
          x2="1371.97"
          y2="1051.86"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3D7394" />
          <stop offset="1" stopColor="#13242E" />
        </linearGradient>

        <linearGradient
          id="paint4_linear_6644_1231"
          x1="711.025"
          y1="779.142"
          x2="7.33713"
          y2="510.91"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#28526F" />
          <stop offset="1" stopColor="#0B273E" />
        </linearGradient>

        <linearGradient
          id="paint5_linear_6644_1231"
          x1="795.249"
          y1="771.635"
          x2="534.792"
          y2="811.563"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#88AFC0" />
          <stop offset="1" stopColor="#22506B" />
        </linearGradient>

        <linearGradient
          id="paint6_linear_6644_1231"
          x1="668.965"
          y1="819.987"
          x2="316.948"
          y2="190.992"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#437C9E" />
          <stop offset="1" stopColor="#032339" />
        </linearGradient>

        <linearGradient
          id="paint7_linear_6644_1231"
          x1="499.328"
          y1="785.747"
          x2="-13.5805"
          y2="431.114"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3D7394" />
          <stop offset="1" stopColor="#13242E" />
        </linearGradient>

        <linearGradient
          id="paint8_linear_6644_1231"
          x1="1280.64"
          y1="231.092"
          x2="1576.12"
          y2="1119.45"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#28526F" />
          <stop offset="1" stopColor="#0B273E" />
        </linearGradient>

        <linearGradient
          id="paint9_linear_6644_1231"
          x1="1207.14"
          y1="155.932"
          x2="1450.5"
          y2="375.211"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#88AFC0" />
          <stop offset="1" stopColor="#22506B" />
        </linearGradient>

        <linearGradient
          id="paint10_linear_6644_1231"
          x1="1353.04"
          y1="239.439"
          x2="1024.59"
          y2="1073.16"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#437C9E" />
          <stop offset="1" stopColor="#032339" />
        </linearGradient>

        <linearGradient
          id="paint11_linear_6644_1231"
          x1="1453.56"
          y1="429.658"
          x2="1515.78"
          y2="1202.37"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3D7394" />
          <stop offset="1" stopColor="#13242E" />
        </linearGradient>

        <linearGradient
          id="paint12_linear_6644_1231"
          x1="426.674"
          y1="264.086"
          x2="35.6134"
          y2="1114.71"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#28526F" />
          <stop offset="1" stopColor="#0B273E" />
        </linearGradient>

        <linearGradient
          id="paint13_linear_6644_1231"
          x1="507.961"
          y1="197.432"
          x2="242.037"
          y2="388.721"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#88AFC0" />
          <stop offset="1" stopColor="#22506B" />
        </linearGradient>

        <linearGradient
          id="paint14_linear_6644_1231"
          x1="353.788"
          y1="264.447"
          x2="588.895"
          y2="1129.14"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#437C9E" />
          <stop offset="1" stopColor="#032339" />
        </linearGradient>

        <linearGradient
          id="paint15_linear_6644_1231"
          x1="233.033"
          y1="442.505"
          x2="86.5102"
          y2="1203.74"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3D7394" />
          <stop offset="1" stopColor="#13242E" />
        </linearGradient>
      </defs>
    </svg>
  );
}

