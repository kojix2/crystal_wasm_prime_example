module PrimeCache
	MAX_N = 1000_000
	@@primes = [] of Int32
	@@ready = false
	@@index = 0

	def self.ensure_primes
		return if @@ready

		sieve = Array(Bool).new(MAX_N + 1, true)
		sieve[0] = false
		sieve[1] = false

		i = 2
		while i * i <= MAX_N
			if sieve[i]
				j = i * i
				while j <= MAX_N
					sieve[j] = false
					j += i
				end
			end
			i += 1
		end

		i = 2
		while i <= MAX_N
			@@primes << i if sieve[i]
			i += 1
		end

		@@ready = true
	end

	def self.next_prime : Int32
		ensure_primes
		return 0 if @@index >= @@primes.size
		value = @@primes[@@index]
		@@index += 1
		value
	end
end

fun next_prime : Int32
	PrimeCache.next_prime
end
