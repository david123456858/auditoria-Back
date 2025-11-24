/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { FailureProccess, SuccessProcess } from '../../../helpers/result'
import { IFailureProcess, ISuccessProcess } from '../../../interfaces/IResult'

/**
 * Service para simular respuestas maliciosas y corruptas
 * Usado exclusivamente para auditoría de seguridad del frontend
 */
export class ServiceApiMaliciosa {
  /**
   * XSS ATTACK: Inyección de scripts maliciosos en campos de respuesta
   * Simula una API comprometida que retorna código JavaScript ejecutable
   * El frontend debe sanitizar estos datos antes de renderizarlos
   * @param country - País/ciudad solicitada (se inyecta con XSS)
   */
  async getXSSPayload (country: string): Promise<ISuccessProcess<any> | IFailureProcess<any>> {
    try {
      const xssPayload = {
        // Inyectamos XSS en el parámetro que el usuario envió
        location: `<script>alert("XSS in ${country}")</script>`,
        country: `${country}<img src=x onerror="alert('XSS via image')">`,
        searchTerm: country, // El término original
        current: {
          temp_c: 25,
          condition: {
            text: `<svg onload="alert('XSS in ${country}')">`,
            icon: 'javascript:alert("XSS")'
          },
          // Inyectamos el país en diferentes contextos
          location_name: `${country}</script><script>alert('Escaped')</script>`,
          city: `${country}" onload="alert('XSS')" data-city="`
        },
        // XSS más sofisticados usando el input del usuario
        description: `<iframe src="javascript:alert('${country}')"></iframe>`,
        name: `<body onload="alert('${country}')">`,
        // XSS encodeado con el país
        encoded: encodeURIComponent(`<script>alert('${country}')</script>`),
        // Event handlers con datos del usuario
        onClick: `<div onclick="alert('Clicked in ${country}')">Click me</div>`,
        // Style injection
        style: `<style>body{background:url("javascript:alert('${country}')")}</style>`,
        // SQL Injection también (si el frontend hace queries)
        sqlInjection: `${country}'; DROP TABLE weather;--`,
        // Command injection
        command: `; rm -rf / # ${country}`,
        // Path traversal
        path: `../../etc/passwd?city=${country}`
      }

      return SuccessProcess(xssPayload, 200)
    } catch (error) {
      return FailureProccess('Error simulando XSS', 500)
    }
  }

  /**
   * BROKEN JSON: Retorna JSON mal formado o corrupto
   * Simula errores de serialización o corrupción de datos
   * El frontend debe manejar errores de parsing gracefully
   * @param country - País/ciudad para incluir en el JSON corrupto
   */
  async getBrokenJSON (country: string): Promise<ISuccessProcess<any> | IFailureProcess<any>> {
    try {
      // Retornamos diferentes tipos de JSON corruptos con el país del usuario
      const corruptionTypes = [
        // String sin cerrar
        `{"location": "${country}", "temp": 25, "broken": "sin cerrar`,
        // Coma extra
        `{"location": "${country}",, "temp": 25}`,
        // Sin comillas en key
        `{location: "${country}", temp: 25}`,
        // Valores undefined
        `{"location": "${country}", "temp": undefined}`,
        // Funciones (no válidas en JSON)
        `{"location": "${country}", "calculate": function(){return 25}}`,
        // NaN e Infinity
        `{"location": "${country}", "temp": NaN, "humidity": Infinity}`,
        // Mezclando comillas simples y dobles
        `{'location': "${country}", 'temp': 25}`,
        // Comentarios (no válidos en JSON estricto)
        `{"location": "${country}", /* comentario */ "temp": 25}`,
        // JSON truncado a la mitad
        `{"location": "${country}", "weather": {"temp": 25, "condition":`,
        // Doble coma con el país
        `{"location": "${country}",,, "temp": 25}`
      ]

      const randomCorruption = corruptionTypes[Math.floor(Math.random() * corruptionTypes.length)]

      // Forzamos a retornar el string corrupto como si fuera válido
      return SuccessProcess(randomCorruption as any, 200)
    } catch (error) {
      return FailureProccess('Error simulando JSON corrupto', 500)
    }
  }

  /**
   * SLOW RESPONSE: Simula latencia extrema en la API
   * Prueba timeouts, loading states y user experience
   * Configurable entre 3-10 segundos de delay
   * @param country - País/ciudad para incluir en la respuesta
   * @param delaySeconds - Segundos de delay (default: 5)
   */
  async getSlowResponse (country: string, delaySeconds: number = 5): Promise<ISuccessProcess<any> | IFailureProcess<any>> {
    try {
      // Simulamos delay de red extremo
      await new Promise(resolve => setTimeout(resolve, delaySeconds * 1000))

      const data = {
        message: `Response delayed by ${delaySeconds} seconds for ${country}`,
        location: country,
        temp_c: 20,
        timestamp: new Date().toISOString(),
        warning: 'This endpoint intentionally slow for testing',
        requestedCity: country,
        processingTime: `${delaySeconds}s`
      }

      return SuccessProcess(data, 200)
    } catch (error) {
      return FailureProccess('Error en respuesta lenta', 500)
    }
  }

  /**
   * ERROR RESPONSE: Simula diferentes códigos de error HTTP
   * Prueba manejo de errores: 400, 401, 403, 404, 429, 500, 502, 503, 504
   * @param country - País/ciudad que se estaba buscando
   * @param errorCode - Código HTTP específico (opcional)
   */
  async getErrorResponse (country: string, errorCode?: number): Promise<ISuccessProcess<any> | IFailureProcess<any>> {
    const errorCodes = [400, 401, 403, 404, 429, 500, 502, 503, 504]
    const code = errorCode ?? errorCodes[Math.floor(Math.random() * errorCodes.length)]

    const errorMessages: Record<number, string> = {
      400: `Bad Request - Invalid parameters for location "${country}"`,
      401: `Unauthorized - Invalid API key for accessing "${country}" data`,
      403: `Forbidden - Access denied to "${country}" weather data`,
      404: `Not Found - Location "${country}" does not exist`,
      429: `Too Many Requests - Rate limit exceeded for "${country}"`,
      500: `Internal Server Error - Failed to fetch "${country}" data`,
      502: `Bad Gateway - Upstream server error for "${country}"`,
      503: `Service Unavailable - Weather service down for "${country}"`,
      504: `Gateway Timeout - Upstream timeout for "${country}"`
    }

    return FailureProccess(errorMessages[code] || `Unknown error for ${country}`, code)
  }

  /**
   * DATA OVERFLOW: Retorna cantidades masivas de datos
   * Simula APIs sin paginación o con límites excesivos
   * Prueba performance y límites de memoria del frontend
   * @param country - País/ciudad para incluir en los datos masivos
   */
  async getOverflowData (country: string): Promise<ISuccessProcess<any> | IFailureProcess<any>> {
    try {
      // Generamos string gigante con el nombre del país repetido
      const hugeString = `${country} - `.repeat(2000000)

      // Array masivo de datos con el país
      const massiveArray = Array.from({ length: 50000 }, (_, i) => ({
        id: i,
        name: `${country} - Location ${i}`,
        description: `Weather data for ${country}: ${'X'.repeat(1000)}`,
        coordinates: {
          lat: Math.random() * 180 - 90,
          lon: Math.random() * 360 - 180
        },
        metadata: {
          city: country,
          data: `${country}: ${'Y'.repeat(500)}`,
          extra: Array.from({ length: 100 }, (_, j) => `${country}_field_${j}`)
        }
      }))

      // Objeto con campos extremadamente largos
      const overflowPayload = {
        status: 'success',
        requestedLocation: country,
        hugeField: hugeString,
        massiveList: massiveArray,
        nestedOverflow: {
          level1: {
            level2: {
              level3: {
                level4: {
                  level5: {
                    country,
                    data: `${country}: ${'Z'.repeat(5000000)}`
                  }
                }
              }
            }
          }
        },
        // Circular reference simulado con repetición
        deepNesting: JSON.parse(JSON.stringify({
          location: country,
          a: { b: { c: { d: { e: `deep data for ${country}` } } } }
        }))
      }

      return SuccessProcess(overflowPayload, 200)
    } catch (error) {
      return FailureProccess('Error generando overflow', 500)
    }
  }

  /**
   * CONTRACT CHANGE: Retorna estructura diferente a la esperada
   * Simula cambios breaking en la API sin versionado
   * El frontend debe manejar campos faltantes/extras/renombrados
   * @param country - País/ciudad para incluir en estructura alterada
   */
  async getContractChange (country: string): Promise<ISuccessProcess<any> | IFailureProcess<any>> {
    try {
      // Estructura completamente diferente a la esperada
      const alteredStructures = [
        // Campos renombrados
        {
          ubicacion: country, // en vez de 'location'
          temperatura: { celsius: 25 }, // en vez de 'temp_c'
          condiciones: { texto: 'Sunny' }, // estructura anidada diferente
          pais: country
        },
        // Tipos cambiados
        {
          location: [country, 'Country'], // array en vez de string
          temp_c: '25', // string en vez de number
          isRaining: 1, // number en vez de boolean
          city: country
        },
        // Campos extra y faltantes
        {
          location: country,
          // temp_c missing
          newField: 'unexpected',
          cityName: country,
          metadata: {
            version: 2,
            deprecated: true,
            requestedFor: country
          }
        },
        // Estructura completamente plana
        {
          location_name: country,
          location_country: 'Unknown',
          current_temp_celsius: 25,
          current_condition_text: 'Sunny',
          current_condition_icon: 'sunny.png',
          requested_location: country
        },
        // Arrays en vez de objetos
        {
          data: [
            ['location', country],
            ['temp_c', 25],
            ['condition', 'Sunny'],
            ['city', country]
          ]
        },
        // Todo en minúsculas
        {
          location: country.toLowerCase(),
          temperature: 25,
          weather: 'sunny',
          city: country.toLowerCase()
        }
      ]

      const randomStructure = alteredStructures[Math.floor(Math.random() * alteredStructures.length)]

      return SuccessProcess(randomStructure, 200)
    } catch (error) {
      return FailureProccess('Error simulando cambio de contrato', 500)
    }
  }

  /**
   * RANDOM CORRUPTION: Combina múltiples ataques aleatoriamente
   * Simula APIs inestables o comprometidas
   * Testing más realista de robustez general
   * @param country - País/ciudad para incluir en ataques
   */
  async getRandomCorruption (country: string): Promise<ISuccessProcess<any> | IFailureProcess<any>> {
    try {
      const attacks = [
        // XSS parcial
        {
          location: country,
          temp_c: 25,
          alert: `<script>alert("random XSS in ${country}")</script>`
        },
        // Tipos inconsistentes
        {
          location: 123,
          temp_c: 'twenty five',
          condition: null,
          humidity: undefined,
          city: country
        },
        // Campos con caracteres especiales
        {
          'location@#': country,
          'temp-c': 25,
          'cond!tion': { '!text': 'Sunny' },
          [`city-${country}`]: 'test'
        },
        // Unicode y emojis problemáticos
        {
          location: `${country} 🌍`,
          temp_c: '25️⃣',
          condition: '☀️🌤️⛅🌦️',
          city: `🏙️ ${country}`
        },
        // SQL Injection attempts
        {
          location: `${country}'; DROP TABLE weather;--`,
          search: `${country}' OR '1'='1`,
          filter: `${country}'; DELETE FROM users WHERE '1'='1'--`
        },
        // Extremely nested structure
        {
          location: country,
          a: { b: { c: { d: { e: { f: { g: { h: { i: { j: `too deep for ${country}` } } } } } } } } }
        },
        // Mixed data types in arrays
        {
          locations: [country, 123, null, undefined, { city: country }, [country]]
        },
        // Valores numéricos extremos
        {
          location: country,
          temp_c: Number.MAX_SAFE_INTEGER,
          humidity: -9999999,
          pressure: 0.000000001
        },
        // Inyección en todos los campos
        {
          [`<script>alert('${country}')</script>`]: country,
          location: `'; DROP TABLE ${country}; --`,
          data: `../../etc/passwd?city=${country}`
        }
      ]

      const randomAttack = attacks[Math.floor(Math.random() * attacks.length)]

      // 30% de chance de añadir delay
      if (Math.random() < 0.3) {
        await new Promise(resolve => setTimeout(resolve, 2000))
      }

      // 20% de chance de retornar error
      if (Math.random() < 0.2) {
        return FailureProccess(`Random corruption error for ${country}`, 500)
      }

      return SuccessProcess(randomAttack, 200)
    } catch (error) {
      return FailureProccess('Error en corrupción aleatoria', 500)
    }
  }

  /**
   * TYPE CONFUSION: Retorna tipos de datos incorrectos
   * Números como strings, strings como arrays, etc.
   * @param country - País/ciudad para incluir con tipos confusos
   */
  async getTypeConfusion (country: string): Promise<ISuccessProcess<any> | IFailureProcess<any>> {
    try {
      const confusedTypes = {
        location: { name: country }, // string como objeto
        temperature: '25', // number como string
        humidity: [85], // number como array
        isRaining: 'true', // boolean como string
        coordinates: `lat:40.4168,lon:-3.7038 in ${country}`, // objeto como string
        date: 1234567890, // fecha como timestamp number
        nullValue: 'null', // null como string
        undefinedValue: 'undefined', // undefined como string
        city: [country], // string como array
        country: { value: country }, // string anidado en objeto
        weather: String(country) // Explícitamente string
      }

      return SuccessProcess(confusedTypes, 200)
    } catch (error) {
      return FailureProccess('Error en confusión de tipos', 500)
    }
  }

  /**
   * ENCODING ISSUES: Problemas de encoding y caracteres especiales
   * @param country - País/ciudad para probar diferentes encodings
   */
  async getEncodingIssues (country: string): Promise<ISuccessProcess<any> | IFailureProcess<any>> {
    try {
      const encodingProblems = {
        location: country,
        utf8: `${country} - Mañana será mejor ☀️`,
        latin1: `${country} - MaÃ±ana`, // mal encoding
        htmlEntities: `&lt;${country}&gt; &amp; &quot;España&quot;`,
        urlEncoded: `${encodeURIComponent(country)}%20Espa%C3%B1a`,
        base64: Buffer.from(country).toString('base64'),
        unicode: `\\u${country.charCodeAt(0).toString(16).padStart(4, '0')}`,
        emoji: `🌡️☀️🌧️⛈️🌈 in ${country}`,
        rtl: `${country} - دیربام`, // Right-to-left text
        specialChars: `${country} < > & " ' / \\ \n \r \t \0`,
        nullByte: `${country}\0Hidden`,
        mixedEncoding: `${country}%20España&#209;`.replace('%20', ' ')
      }

      return SuccessProcess(encodingProblems, 200)
    } catch (error) {
      return FailureProccess('Error en encoding', 500)
    }
  }

  /**
   * RATE LIMIT SIMULATION: Simula rate limiting de la API
   * @param country - País/ciudad que se estaba buscando
   */
  async getRateLimitError (country: string): Promise<ISuccessProcess<any> | IFailureProcess<any>> {
    const retryAfter = Math.floor(Math.random() * 300) + 60 // 60-360 segundos

    return FailureProccess(
      `Rate limit exceeded for "${country}". Retry after ${retryAfter} seconds`,
      429
    )
  }
}
