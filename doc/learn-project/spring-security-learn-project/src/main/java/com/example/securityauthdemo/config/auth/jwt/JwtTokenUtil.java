package com.example.securityauthdemo.config.auth.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Date;

@ConfigurationProperties(prefix = "jwt")
@Component
@Data
public class JwtTokenUtil {
  private String secret;
  private Long expiration;
  private String header;

  public String generateToken(UserDetails userDetails) {
    return Jwts.builder()
      .setSubject(userDetails.getUsername())
      .setExpiration(new Date(System.currentTimeMillis() + expiration))
      .setIssuedAt(new Date())
      .signWith(SignatureAlgorithm.HS512, secret)
      .compact();
  }

  public String getUsernameFromToken(String token) {
    try {
      return getClaimsFromToken(token).getSubject();
    } catch (Exception e) {
      return null;
    }
  }

  public Boolean isTokenValidated(String token) {
    try {
      return getClaimsFromToken(token).getExpiration().before(new Date());
    } catch (Exception e) {
      return false;
    }
  }

  public String refreshToken(String token) {
    try {
      return Jwts.builder()
        .setSubject(getClaimsFromToken(token).getSubject())
        .setExpiration(new Date(System.currentTimeMillis() + expiration))
        .setIssuedAt(new Date())
        .signWith(SignatureAlgorithm.HS512, secret)
        .compact();
    } catch (Exception e) {
      return null;
    }
  }

  public Boolean validateToken(String token) {
    return  !isTokenValidated(token);
  }

  private Claims getClaimsFromToken(String token) {
    Claims claims;
    try {
      claims = Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody();
    } catch (Exception e) {
      claims = null;
    }
    return claims;
  }
}
