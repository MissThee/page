package com.example.securityauthdemo.config.auth.jwt;

import com.example.securityauthdemo.model.SysUser;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
@ConfigurationProperties(prefix = "jwt")
@Component
@Data
public class JwtTokenUtil {
  private String secret;
  private Long expiration;
  private String header;

  public String generateToken(UserDetails userDetails) {
    Map<String, Object> claims = new HashMap<>(2);
    claims.put("sub", userDetails.getUsername());
    claims.put("created", new Date());
    return buildToken(claims);
  }

  public String getUsernameFromToken(String token) {
    String username;
    try {
      Claims claims = getClaimsFromToken(token);
      username = claims.getSubject();
    } catch (Exception e) {
      username = null;
    }
    return username;
  }

  public Boolean isTokenExpired(String token) {
    try {
      Claims claims = getClaimsFromToken(token);
      Date expiration = claims.getExpiration();
      return expiration.before(new Date());
    } catch (Exception e) {
      return false;
    }
  }

  public String refreshToken(String token) {
    String refreshToken;
    try {
      Claims claims = getClaimsFromToken(token);
      claims.put("created", new Date());
      refreshToken = buildToken(claims);
    } catch (Exception e) {
      refreshToken = null;
    }
    return refreshToken;
  }

  public Boolean validateToken(String token, UserDetails userDetails) {
    String username = getUsernameFromToken(token);
    return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
  }

  private String buildToken(Map<String, Object> claims) {
    Date expirationDate = new Date(System.currentTimeMillis() + expiration);
    return Jwts.builder().setClaims(claims)
      .setExpiration(expirationDate)
      .signWith(SignatureAlgorithm.HS512, secret)
      .compact();
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
