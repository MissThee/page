//package auth.server.controller;
//
//import org.springframework.security.authentication.InsufficientAuthenticationException;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.oauth2.common.exceptions.InvalidClientException;
//import org.springframework.security.oauth2.common.exceptions.RedirectMismatchException;
//import org.springframework.security.oauth2.common.exceptions.UnsupportedResponseTypeException;
//import org.springframework.security.oauth2.common.util.OAuth2Utils;
//import org.springframework.security.oauth2.provider.AuthorizationRequest;
//import org.springframework.security.oauth2.provider.ClientDetails;
//import org.springframework.security.oauth2.provider.OAuth2RequestFactory;
//import org.springframework.security.oauth2.provider.endpoint.AuthorizationEndpoint;
//import org.springframework.stereotype.Controller;
//import org.springframework.util.StringUtils;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.SessionAttributes;
//import org.springframework.web.bind.support.SessionStatus;
//import org.springframework.web.servlet.ModelAndView;
//
//import javax.servlet.http.HttpServletRequest;
//import java.security.Principal;
//import java.util.Map;
//import java.util.Set;
//
//@Controller
//@SessionAttributes("authorizationRequest")
//public class CodeController extends AuthorizationEndpoint {
////    @RequestMapping("/oauth/authorize")
////    public ModelAndView getAccessConfirmation() throws Exception {
////        ModelAndView modelAndView = new ModelAndView();
////        modelAndView.setViewName("base-approval");
////        return modelAndView;
////    }
//
//    @RequestMapping(value = "/oauth/authorize")
//    public ModelAndView authorize(Map<String, Object> model, @RequestParam Map<String, String> parameters,
//                                  SessionStatus sessionStatus, Principal principal) {
//
//        // Pull out the authorization request first, using the OAuth2RequestFactory. All further logic should
//        // query off of the authorization request instead of referring back to the parameters map. The contents of the
//        // parameters map will be stored without change in the AuthorizationRequest object once it is created.
//        AuthorizationRequest authorizationRequest = getOAuth2RequestFactory().createAuthorizationRequest(parameters);
//
//        Set<String> responseTypes = authorizationRequest.getResponseTypes();
//
//        if (!responseTypes.contains("token") && !responseTypes.contains("code")) {
//            throw new UnsupportedResponseTypeException("Unsupported response types: " + responseTypes);
//        }
//
//        if (authorizationRequest.getClientId() == null) {
//            throw new InvalidClientException("A client id must be provided");
//        }
//
//        try {
//
//            if (!(principal instanceof Authentication) || !((Authentication) principal).isAuthenticated()) {
//                throw new InsufficientAuthenticationException(
//                        "User must be authenticated with Spring Security before authorization can be completed.");
//            }
//
//            ClientDetails client = getClientDetailsService().loadClientByClientId(authorizationRequest.getClientId());
//
//            // The resolved redirect URI is either the redirect_uri from the parameters or the one from
//            // clientDetails. Either way we need to store it on the AuthorizationRequest.
//            String redirectUriParameter = authorizationRequest.getRequestParameters().get(OAuth2Utils.REDIRECT_URI);
//            String resolvedRedirect = redirectResolver.resolveRedirect(redirectUriParameter, client);
//            if (!StringUtils.hasText(resolvedRedirect)) {
//                throw new RedirectMismatchException(
//                        "A redirectUri must be either supplied or preconfigured in the ClientDetails");
//            }
//            authorizationRequest.setRedirectUri(resolvedRedirect);
//
//            // We intentionally only validate the parameters requested by the client (ignoring any data that may have
//            // been added to the request by the manager).
//            oauth2RequestValidator.validateScope(authorizationRequest, client);
//
//            // Some systems may allow for approval decisions to be remembered or approved by default. Check for
//            // such logic here, and set the approved flag on the authorization request accordingly.
//            authorizationRequest = userApprovalHandler.checkForPreApproval(authorizationRequest,
//                    (Authentication) principal);
//            // TODO: is this call necessary?
//            boolean approved = userApprovalHandler.isApproved(authorizationRequest, (Authentication) principal);
//            authorizationRequest.setApproved(approved);
//
//            // Validation is all done, so we can check for auto approval...
//            if (authorizationRequest.isApproved()) {
//                if (responseTypes.contains("token")) {
//                    return getImplicitGrantResponse(authorizationRequest);
//                }
//                if (responseTypes.contains("code")) {
//                    return new ModelAndView(getAuthorizationCodeResponse(authorizationRequest,
//                            (Authentication) principal));
//                }
//            }
//
//            // Store authorizationRequest AND an immutable Map of authorizationRequest in session
//            // which will be used to validate against in approveOrDeny()
//            model.put(AUTHORIZATION_REQUEST_ATTR_NAME, authorizationRequest);
//            model.put(ORIGINAL_AUTHORIZATION_REQUEST_ATTR_NAME, unmodifiableMap(authorizationRequest));
//
//            return getUserApprovalPageResponse(model, authorizationRequest, (Authentication) principal);
//
//        }
//        catch (RuntimeException e) {
//            sessionStatus.setComplete();
//            throw e;
//        }
//
//    }
//}